/* eslint-disable no-unused-vars */
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const checkEmail = (email: string) => {
  return emailRegex.test(email);
};

// 소문자, 숫자 포함, 8글자 이상
const passwordRegex = /(?=.*\d)(?=.*[a-z]).{8,}/;

export const checkPassword = (password: string) => {
  return passwordRegex.test(password);
};

export const checkHour = (hour: number) => {
  if (hour < 0 || hour > 24) {
    return false;
  }

  return true;
};

export const checkWeek = (week: number) => {
  if (week <= 0 || week > 7) {
    return false;
  }

  return true;
};

export const checkMonth = (month: number) => {
  if (month <= 0 || month > 31) {
    return false;
  }

  return true;
};
