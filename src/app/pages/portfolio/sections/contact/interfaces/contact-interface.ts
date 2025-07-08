export interface ContactMethod {
  name: string;
  value: string;
  link: string;
  icon: string;
  description: string;
  color: string;
}

export interface TechParticle {
  x: number;
  y: number;
  size: number;
  delay: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactConfig {
  header: {
    title: string;
    subtitle: string;
    status: {
      text: string;
      available: boolean;
    };
  };
  form: {
    title: string;
    subtitle: string;
    submitText: string;
    successMessage: {
      title: string;
      description: string;
    };
  };
  methods: ContactMethod[];
  email: {
    recipient: string;
    subject: string;
  };
}