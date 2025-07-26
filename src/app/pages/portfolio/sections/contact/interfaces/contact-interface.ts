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
  name: string;        // → {{from_name}}
  email: string;       // → {{from_email}} y {{reply_to}}
  subject: string;     // → {{subject}}
  message: string;     // → {{message}}
  brand?: string;      // Nueva propiedad opcional → {{brand}}
  bcc?: string;        // Nueva propiedad opcional → {{bcc}}
  cc?: string;         // Nueva propiedad opcional → {{cc}}
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
    brand?: string;    // Nueva propiedad opcional para la marca
    defaultBcc?: string; // Nueva propiedad opcional
    defaultCc?: string;  // Nueva propiedad opcional
  };
}