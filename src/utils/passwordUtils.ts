export function checkPasswordStrength(password: string): number {
  let strength = 0;
  
  // 检查长度
  if (password.length >= 8) strength++;
  
  // 检查是否包含数字
  if (/\d/.test(password)) strength++;
  
  // 检查是否包含小写字母
  if (/[a-z]/.test(password)) strength++;
  
  // 检查是否包含大写字母
  if (/[A-Z]/.test(password)) strength++;
  
  // 检查是否包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return strength;
}