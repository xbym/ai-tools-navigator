export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  // 检查长度
  if (password.length < 8) {
    feedback.push('密码应至少包含8个字符');
  } else {
    score += 1;
  }

  // 检查是否包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含至少一个大写字母');
  }

  // 检查是否包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含至少一个小写字母');
  }

  // 检查是否包含数字
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含至少一个数字');
  }

  // 检查是否包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含至少一个特殊字符');
  }

  return { score, feedback };
}