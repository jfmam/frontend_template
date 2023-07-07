export type UserLoginType = {
  email: string;
  password: string;
};

export type Token = {
  token: string;
};

export type SignUpType = {
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
  agree: boolean;
};
