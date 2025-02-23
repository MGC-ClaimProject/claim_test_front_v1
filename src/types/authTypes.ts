// 📂 src/types/authTypes.ts
export interface Document {
  id: number;
  document_url: string;
  created_at: string;
  page_count?: number;
}

export interface ClaimData {
  claimId?: number;
  memberId?: number;
  member?: Member;
  insured?: Member;
  applicant?: Member;
  symptoms?: string;
  incidentType?: string;
  treatmentType?: string;
  hospitalDays?: number | null;
  incidentDate?: string;
  applicantSignature?: string | null;
  insuredSignature?: string | null;
  bank?: string | null;
  account?: string | null;
  isSameAsPayoutAccount?: boolean;
  claimStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  claimInsurers?: { company: string; policy_name: string }[];
  documents?: Document[];
  selectedInsurances?: { company: string; policy_name: string }[];
}

export interface User {
  id: number;
  email: string;
  user_name: string;
  phone: string;
  birth: string;
  member_id: number;
}

export interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

export interface Insurance {
  id: number;
  company: string;
  policy_name: string;
  premium: number;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  member: Member | null;
  members: Member[];
  claimData: ClaimData | null;
  selectedMemberId: number | null;
  isAuthenticated: boolean;
  setSelectedMemberId: (id: number | null) => void;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchMember: (id: number) => Promise<void>;
  setClaimData: (data: ClaimData | null) => void;
  checkAuth: () => Promise<boolean>;
  login: (token: string) => void;
  logout: () => Promise<void>;
}
