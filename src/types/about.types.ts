export interface IAppOwner {
  name: string;
  role: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  githubUrl?: string;
}

export interface IAppMetadata {
  title: string;
  shortDescription: string;
  version: string;
  releaseYear: string;
  owner: IAppOwner;
  techStack: string[];
}
