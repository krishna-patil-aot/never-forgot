import { prisma } from '../lib/prisma';
import { computeExpiryStatus } from './repositories/asset.repository';

export async function seedDatabase(): Promise<void> {
  // Check if default user exists
  let user = await prisma.user.findUnique({
    where: { email: 'krishna.patil@algoocean.com' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 'user-default',
        email: 'krishna.patil@algoocean.com',
        fullName: 'Krishna Patil',
        phone: '+91 98765 43210',
        role: 'user',
        isProfileComplete: true,
        notificationEmailEnabled: true,
        notificationInAppEnabled: true,
      },
    });
  }

  // Check if assets already seeded
  const existingCount = await prisma.asset.count({
    where: { userId: user.id },
  });

  if (existingCount > 0) {
    console.log(`[Seed] Database already has ${existingCount} assets. Skipping asset seeding.`);
    return;
  }

  console.log('[Seed] Seeding initial rich assets and milestones...');

  // 1. Apple iPhone 15 Pro
  const d1Expiry = new Date('2026-10-15T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Apple iPhone 15 Pro (256GB - Natural Titanium)',
      providerOrBrand: 'Apple',
      category: 'electronics',
      identifierNumber: 'IMEI: 354892019482910',
      startDate: new Date('2025-10-15T00:00:00.000Z'),
      expiryOrRenewalDate: d1Expiry,
      validityMonths: 12,
      documentName: 'apple_store_invoice_15pro.pdf',
      price: 134900,
      status: computeExpiryStatus(d1Expiry),
      notes: 'Covered under Apple 1-Year Limited Hardware Warranty.',
    },
  });

  // 2. Royal Enfield Hunter 350
  const d2Expiry = new Date('2029-06-01T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Royal Enfield Hunter 350 (Dapper Ash)',
      providerOrBrand: 'Royal Enfield',
      category: 'vehicle',
      identifierNumber: 'Reg: MH 12 AB 4590',
      startDate: new Date('2026-06-01T00:00:00.000Z'),
      expiryOrRenewalDate: d2Expiry,
      validityMonths: 36,
      documentName: 'royal_enfield_rc_book.pdf',
      price: 174000,
      status: computeExpiryStatus(d2Expiry),
      notes: 'Free roadside assistance valid until June 2027.',
      serviceMilestones: {
        create: [
          {
            title: '1st Free Service (500km / 45 Days)',
            dueDate: new Date('2026-07-15T00:00:00.000Z'),
            isFree: true,
            status: 'completed',
            cost: 0,
            notes: 'Engine oil replaced, chain tension checked at Authorized RE service center.',
          },
          {
            title: '2nd Free Service (5,000km / 180 Days)',
            dueDate: new Date('2026-11-28T00:00:00.000Z'),
            isFree: true,
            status: 'pending',
            cost: 0,
            notes: 'General checkup, spark plug cleaning, free labor.',
          },
          {
            title: '3rd Free Service (10,000km / 365 Days)',
            dueDate: new Date('2027-05-30T00:00:00.000Z'),
            isFree: true,
            status: 'pending',
            cost: 0,
          },
        ],
      },
    },
  });

  // 3. Star Health Insurance
  const d3Expiry = new Date('2026-11-19T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Star Health Optima Secure (Family Floater)',
      providerOrBrand: 'Star Health Insurance',
      category: 'health_insurance',
      identifierNumber: 'Policy: SH-2024-894721',
      startDate: new Date('2025-11-20T00:00:00.000Z'),
      expiryOrRenewalDate: d3Expiry,
      validityMonths: 12,
      documentName: 'star_health_policy_schedule.pdf',
      status: computeExpiryStatus(d3Expiry),
      notes: 'No-claim bonus active. Grace period is 30 days after due date.',
      policyDetails: {
        create: {
          policyNumber: 'SH-2024-894721',
          sumInsured: 1500000,
          premiumAmount: 24500,
          premiumDueDate: d3Expiry,
          tpaHelpline: '1800-425-2255',
          cashlessHospitalUrl: 'https://starhealth.in/network-hospitals',
        },
      },
    },
  });

  // 4. Kent RO Purifier AMC
  const d4Expiry = new Date('2027-04-09T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Kent Grand Plus RO Water Purifier',
      providerOrBrand: 'Kent RO Systems',
      category: 'home_amc',
      identifierNumber: 'AMC ID: KNT-AMC-9812',
      startDate: new Date('2026-04-10T00:00:00.000Z'),
      expiryOrRenewalDate: d4Expiry,
      validityMonths: 12,
      documentName: 'kent_amc_contract.pdf',
      price: 4800,
      status: computeExpiryStatus(d4Expiry),
      notes: 'Includes 3 mandatory visits per year.',
      serviceMilestones: {
        create: [
          {
            title: 'Carbon & Sediment Filter Replacement',
            dueDate: new Date('2026-10-10T00:00:00.000Z'),
            isFree: true,
            status: 'pending',
            notes: 'Pre-paid under annual maintenance contract.',
          },
        ],
      },
    },
  });

  // 5. Sony Bravia TV (Expired)
  const d5Expiry = new Date('2025-03-01T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Sony Bravia 55-inch 4K Google TV (X82L)',
      providerOrBrand: 'Sony Electronics',
      category: 'electronics',
      identifierNumber: 'Serial: SN-492817260',
      startDate: new Date('2024-03-01T00:00:00.000Z'),
      expiryOrRenewalDate: d5Expiry,
      validityMonths: 12,
      documentName: 'croma_invoice_sony_tv.pdf',
      price: 68990,
      status: computeExpiryStatus(d5Expiry),
      notes: 'Comprehensive warranty expired. Consider 3rd-party extended cover.',
    },
  });

  // 6. Apple MacBook Pro
  const d6Expiry = new Date('2027-01-09T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Apple MacBook Pro 14" (M3 Pro - 18GB/512GB)',
      providerOrBrand: 'Apple',
      category: 'electronics',
      identifierNumber: 'Serial: C02GL480MD6R',
      startDate: new Date('2026-01-10T00:00:00.000Z'),
      expiryOrRenewalDate: d6Expiry,
      validityMonths: 12,
      documentName: 'apple_macbook_receipt.pdf',
      price: 199900,
      status: computeExpiryStatus(d6Expiry),
      notes: 'Covered under AppleCare+ with accidental damage protection.',
    },
  });

  // 7. Honda City Hybrid
  const d7Expiry = new Date('2028-08-19T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Honda City ZX e:HEV Hybrid (Lunar Silver)',
      providerOrBrand: 'Honda Motors',
      category: 'vehicle',
      identifierNumber: 'Reg: MH 12 PQ 8899',
      startDate: new Date('2025-08-20T00:00:00.000Z'),
      expiryOrRenewalDate: d7Expiry,
      validityMonths: 36,
      documentName: 'honda_warranty_booklet.pdf',
      price: 2050000,
      status: computeExpiryStatus(d7Expiry),
      notes: 'Extended powertrain warranty up to 5 years.',
      serviceMilestones: {
        create: [
          {
            title: '20,000km Major Periodic Service',
            dueDate: new Date('2026-11-15T00:00:00.000Z'),
            isFree: true,
            status: 'pending',
            cost: 0,
            notes: 'Includes synthetic oil change and hybrid battery health check.',
          },
        ],
      },
    },
  });

  // 8. HDFC ERGO Car Insurance
  const d8Expiry = new Date('2026-10-24T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'HDFC ERGO Drive Safe Comprehensive Car Insurance',
      providerOrBrand: 'HDFC ERGO',
      category: 'health_insurance',
      identifierNumber: 'Policy: HDFC-CAR-2024-9012',
      startDate: new Date('2025-10-25T00:00:00.000Z'),
      expiryOrRenewalDate: d8Expiry,
      validityMonths: 12,
      documentName: 'hdfc_ergo_policy_schedule.pdf',
      price: 32000,
      status: computeExpiryStatus(d8Expiry),
      notes: 'Zero depreciation + engine protect add-on active.',
      policyDetails: {
        create: {
          policyNumber: 'HDFC-CAR-2024-9012',
          sumInsured: 1850000,
          premiumAmount: 32000,
          premiumDueDate: d8Expiry,
          tpaHelpline: '1800-2666-400',
        },
      },
    },
  });

  // 9. Dyson Vacuum
  const d9Expiry = new Date('2027-05-14T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
      providerOrBrand: 'Dyson India',
      category: 'electronics',
      identifierNumber: 'Serial: DYS-V12-984120',
      startDate: new Date('2025-05-15T00:00:00.000Z'),
      expiryOrRenewalDate: d9Expiry,
      validityMonths: 24,
      documentName: 'dyson_official_invoice.pdf',
      price: 52900,
      status: computeExpiryStatus(d9Expiry),
      notes: '2-year standard Dyson manufacturer warranty.',
    },
  });

  // 10. Passport & Visa
  const d10Expiry = new Date('2034-06-14T00:00:00.000Z');
  await prisma.asset.create({
    data: {
      userId: user.id,
      title: 'Republic of India Passport & 10-Yr US B1/B2 Visa',
      providerOrBrand: 'Passport Seva / US Embassy',
      category: 'personal_doc',
      identifierNumber: 'Doc No: Z5928172',
      startDate: new Date('2024-06-15T00:00:00.000Z'),
      expiryOrRenewalDate: d10Expiry,
      validityMonths: 120,
      documentName: 'passport_scan_copy.pdf',
      status: computeExpiryStatus(d10Expiry),
      notes: 'Keep renewal reminder set 9 months prior to expiry.',
    },
  });

  // Seed sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Warranty expiring in 9 days',
        message: 'Apple iPhone 15 Pro standard 1-year coverage expires on 15 Oct 2026. File any pending display/battery claims now.',
        category: 'electronics',
        type: 'warranty_expiry',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Health policy renewal due next month',
        message: 'Star Health Optima Secure renewal window is active. Grace period ends in 44 days.',
        category: 'health_insurance',
        type: 'policy_renewal',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Free periodic service upcoming',
        message: 'Royal Enfield Hunter 350 second scheduled service (5,000km) is due on 28 Nov 2026.',
        category: 'vehicle',
        type: 'service_due',
        isRead: true,
      },
    ],
  });

  console.log('[Seed] Database successfully seeded with 10 assets and notifications.');
}
