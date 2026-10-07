import { prisma } from '@/lib/prisma';
import {
  AssetCategory,
  ExpiryStatus,
  IUniversalAsset,
  IServiceMilestone,
  IPolicyDetails,
} from '@/types/asset.types';
import {
  ICreateAssetDto,
  IUpdateAssetDto,
  IAssetFilterQuery,
  IPaginatedData,
  IPaginationMeta,
} from '@/types/api.types';

// Helper to compute fresh status based on current date
export function computeExpiryStatus(expiryDate: Date): ExpiryStatus {
  const now = new Date().getTime();
  const diffDays = Math.ceil((expiryDate.getTime() - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'expiring_soon';
  return 'active';
}

// Convert Prisma Asset model with relations to strict IUniversalAsset domain interface
type PrismaAssetWithRelations = {
  id: string;
  userId: string;
  title: string;
  providerOrBrand: string;
  category: string;
  identifierNumber: string | null;
  startDate: Date;
  expiryOrRenewalDate: Date;
  validityMonths: number;
  documentUrl: string | null;
  documentName: string | null;
  price: number | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  serviceMilestones: {
    id: string;
    assetId: string;
    title: string;
    dueDate: Date;
    isFree: boolean;
    status: string;
    cost: number | null;
    notes: string | null;
  }[];
  policyDetails: {
    id: string;
    assetId: string;
    policyNumber: string;
    sumInsured: number | null;
    premiumAmount: number;
    premiumDueDate: Date;
    tpaHelpline: string | null;
    cashlessHospitalUrl: string | null;
  } | null;
};

export function mapPrismaToUniversalAsset(raw: PrismaAssetWithRelations): IUniversalAsset {
  const dynamicStatus = computeExpiryStatus(raw.expiryOrRenewalDate);

  const serviceMilestones: IServiceMilestone[] | undefined =
    raw.serviceMilestones.length > 0
      ? raw.serviceMilestones.map((m) => ({
          id: m.id,
          title: m.title,
          dueDate: m.dueDate.toISOString(),
          isFree: m.isFree,
          status: m.status as 'pending' | 'completed' | 'missed',
          cost: m.cost ?? undefined,
          notes: m.notes ?? undefined,
        }))
      : undefined;

  const policyDetails: IPolicyDetails | undefined = raw.policyDetails
    ? {
        policyNumber: raw.policyDetails.policyNumber,
        sumInsured: raw.policyDetails.sumInsured ?? undefined,
        premiumAmount: raw.policyDetails.premiumAmount,
        premiumDueDate: raw.policyDetails.premiumDueDate.toISOString(),
        tpaHelpline: raw.policyDetails.tpaHelpline ?? undefined,
        cashlessHospitalUrl: raw.policyDetails.cashlessHospitalUrl ?? undefined,
      }
    : undefined;

  return {
    id: raw.id,
    userId: raw.userId,
    title: raw.title,
    providerOrBrand: raw.providerOrBrand,
    category: raw.category as AssetCategory,
    identifierNumber: raw.identifierNumber ?? undefined,
    startDate: raw.startDate.toISOString(),
    expiryOrRenewalDate: raw.expiryOrRenewalDate.toISOString(),
    validityMonths: raw.validityMonths,
    documentUrl: raw.documentUrl ?? undefined,
    documentName: raw.documentName ?? undefined,
    status: dynamicStatus,
    price: raw.price ?? undefined,
    serviceMilestones,
    policyDetails,
    notes: raw.notes ?? undefined,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export class AssetRepository {
  /**
   * Find assets matching filters, search queries, with sorting and pagination
   */
  static async findMany(
    filters: IAssetFilterQuery,
    userId: string
  ): Promise<IPaginatedData<IUniversalAsset>> {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.max(1, Math.min(100, filters.pageSize ?? 50));
    const skip = (page - 1) * pageSize;

    // Build Prisma query condition
    const whereConditions: {
      userId: string;
      category?: string;
      OR?: Array<{
        title?: { contains: string };
        providerOrBrand?: { contains: string };
        identifierNumber?: { contains: string };
        notes?: { contains: string };
      }>;
    } = {
      userId,
    };

    if (filters.category && filters.category !== 'all') {
      whereConditions.category = filters.category;
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim();
      whereConditions.OR = [
        { title: { contains: q } },
        { providerOrBrand: { contains: q } },
        { identifierNumber: { contains: q } },
        { notes: { contains: q } },
      ];
    }

    // Determine sort order
    let orderBy:
      | { expiryOrRenewalDate: 'asc' | 'desc' }
      | { title: 'asc' }
      | { createdAt: 'desc' } = { expiryOrRenewalDate: 'asc' };

    switch (filters.sortBy) {
      case 'expiry_desc':
        orderBy = { expiryOrRenewalDate: 'desc' };
        break;
      case 'name_asc':
        orderBy = { title: 'asc' };
        break;
      case 'recently_added':
        orderBy = { createdAt: 'desc' };
        break;
      case 'expiry_asc':
      default:
        orderBy = { expiryOrRenewalDate: 'asc' };
        break;
    }

    const [rawAssets, totalCount] = await Promise.all([
      prisma.asset.findMany({
        where: whereConditions,
        include: {
          serviceMilestones: {
            orderBy: { dueDate: 'asc' },
          },
          policyDetails: true,
        },
        orderBy,
      }),
      prisma.asset.count({ where: whereConditions }),
    ]);

    // Map to domain entity and apply dynamic status filter if specified
    const mapped: IUniversalAsset[] = rawAssets.map(mapPrismaToUniversalAsset);

    const filteredAssets: IUniversalAsset[] =
      filters.status && filters.status !== 'all'
        ? mapped.filter((a: IUniversalAsset) => a.status === filters.status)
        : mapped;

    // Paginate in memory cleanly
    const total = filters.status && filters.status !== 'all' ? filteredAssets.length : totalCount;
    const paginatedItems = filteredAssets.slice(skip, skip + pageSize);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const paginationMeta: IPaginationMeta = {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      items: paginatedItems,
      pagination: paginationMeta,
    };
  }

  /**
   * Find single asset by ID
   */
  static async findById(id: string, userId: string): Promise<IUniversalAsset | null> {
    const raw = await prisma.asset.findFirst({
      where: { id, userId },
      include: {
        serviceMilestones: {
          orderBy: { dueDate: 'asc' },
        },
        policyDetails: true,
      },
    });

    if (!raw) return null;
    return mapPrismaToUniversalAsset(raw);
  }

  /**
   * Create a new asset with optional milestones and policy details in an atomic transaction
   */
  static async create(dto: ICreateAssetDto, userId: string): Promise<IUniversalAsset> {
    const expiryDate = new Date(dto.expiryOrRenewalDate);
    const calculatedStatus = computeExpiryStatus(expiryDate);

    const created = await prisma.asset.create({
      data: {
        userId,
        title: dto.title,
        providerOrBrand: dto.providerOrBrand,
        category: dto.category,
        identifierNumber: dto.identifierNumber || null,
        startDate: new Date(dto.startDate),
        expiryOrRenewalDate: expiryDate,
        validityMonths: dto.validityMonths,
        documentUrl: dto.documentUrl || null,
        documentName: dto.documentName || null,
        price: dto.price !== undefined && dto.price !== null ? Math.max(0, dto.price) : null,
        status: calculatedStatus,
        notes: dto.notes || null,
        serviceMilestones: dto.serviceMilestones
          ? {
              create: dto.serviceMilestones.map((m) => ({
                title: m.title,
                dueDate: new Date(m.dueDate),
                isFree: m.isFree,
                status: m.status || 'pending',
                cost: m.cost !== undefined && m.cost !== null ? Math.max(0, m.cost) : null,
                notes: m.notes || null,
              })),
            }
          : undefined,
        policyDetails: dto.policyDetails
          ? {
              create: {
                policyNumber: dto.policyDetails.policyNumber,
                sumInsured:
                  dto.policyDetails.sumInsured !== undefined && dto.policyDetails.sumInsured !== null
                    ? Math.max(0, dto.policyDetails.sumInsured)
                    : null,
                premiumAmount: Math.max(0, dto.policyDetails.premiumAmount || 0),
                premiumDueDate: new Date(dto.policyDetails.premiumDueDate),
                tpaHelpline: dto.policyDetails.tpaHelpline || null,
                cashlessHospitalUrl: dto.policyDetails.cashlessHospitalUrl || null,
              },
            }
          : undefined,
      },
      include: {
        serviceMilestones: {
          orderBy: { dueDate: 'asc' },
        },
        policyDetails: true,
      },
    });

    return mapPrismaToUniversalAsset(created);
  }

  /**
   * Update an existing asset
   */
  static async update(
    id: string,
    dto: IUpdateAssetDto,
    userId: string
  ): Promise<IUniversalAsset | null> {
    const existing = await prisma.asset.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    const expiryDate = dto.expiryOrRenewalDate
      ? new Date(dto.expiryOrRenewalDate)
      : existing.expiryOrRenewalDate;
    const calculatedStatus = computeExpiryStatus(expiryDate);

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        title: dto.title ?? existing.title,
        providerOrBrand: dto.providerOrBrand ?? existing.providerOrBrand,
        category: dto.category ?? existing.category,
        identifierNumber:
          dto.identifierNumber !== undefined
            ? dto.identifierNumber
            : existing.identifierNumber,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        expiryOrRenewalDate: expiryDate,
        validityMonths: dto.validityMonths ?? existing.validityMonths,
        documentUrl:
          dto.documentUrl !== undefined ? dto.documentUrl : existing.documentUrl,
        documentName:
          dto.documentName !== undefined ? dto.documentName : existing.documentName,
        price:
          dto.price !== undefined
            ? dto.price !== null
              ? Math.max(0, dto.price)
              : null
            : existing.price,
        status: calculatedStatus,
        notes: dto.notes !== undefined ? dto.notes : existing.notes,
      },
      include: {
        serviceMilestones: {
          orderBy: { dueDate: 'asc' },
        },
        policyDetails: true,
      },
    });

    return mapPrismaToUniversalAsset(updated);
  }

  /**
   * Delete an asset by ID
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.asset.findFirst({
      where: { id, userId },
    });

    if (!existing) return false;

    await prisma.asset.delete({ where: { id } });
    return true;
  }

  /**
   * Toggle service milestone completion status
   */
  static async toggleMilestone(
    assetId: string,
    milestoneId: string,
    userId: string
  ): Promise<IServiceMilestone | null> {
    const asset = await prisma.asset.findFirst({
      where: { id: assetId, userId },
    });

    if (!asset) return null;

    const milestone = await prisma.serviceMilestone.findFirst({
      where: { id: milestoneId, assetId },
    });

    if (!milestone) return null;

    const nextStatus = milestone.status === 'completed' ? 'pending' : 'completed';

    const updated = await prisma.serviceMilestone.update({
      where: { id: milestoneId },
      data: { status: nextStatus },
    });

    return {
      id: updated.id,
      title: updated.title,
      dueDate: updated.dueDate.toISOString(),
      isFree: updated.isFree,
      status: updated.status as 'pending' | 'completed' | 'missed',
      cost: updated.cost ?? undefined,
      notes: updated.notes ?? undefined,
    };
  }
}
