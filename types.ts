export interface Student {
  id: string;
  uid: string;
  roll_number: string;
  name: string;
  father_name: string;
  mother_name?: string;
  class: string;
  address: string;
  photo_url: string;
  date_of_birth: string;
  mobile?: string;
  blood_group?: string;
  id_number?: string;
  [key: string]: string | undefined;
}

export interface SchoolConfig {
  name: string;
  address: string;
  logoUrl: string | null;
}
