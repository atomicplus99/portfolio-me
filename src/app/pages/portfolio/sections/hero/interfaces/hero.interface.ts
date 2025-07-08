export interface CodeLine {
  text: string;
  class: string;
}

export interface CodeSnippet {
  lines: CodeLine[];
}

export interface Quote {
  text: string;
  author: string;
  year: string;
}

export interface Developer {
  name: string;
  title: string;
  description: string;
  location: string;
  experience: string;
  email: string;
  skills: string[];
  status: {
    available: boolean;
    message: string;
  };
}