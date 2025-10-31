export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  companyId: string;
  companyName: string;
  avatarUrl: string | null;
  acceptTerms: boolean;
  emailNotifications: boolean;
}

export interface StepComponentProps {
  formData: RegisterFormData;
  onInputChange: (field: keyof RegisterFormData, value: string | boolean | null) => void;
  onNext: () => void;
  onBack?: () => void;
  showError: (title: string, message: string, variant: 'error' | 'warning' | 'info') => void;
}

