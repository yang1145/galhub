const express = require('express');
const svgCaptcha = require('svg-captcha');

// 创建路由实例
const router = express.Router();

// API路由：生成验证码
router.get('/', (req, res) => {
  // 生成验证码
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1iIl', // 排除易混淆字符
    noise: 2,
    color: true,
    background: '#f0f0f0'
  });
  
  // 保存验证码（实际应用中应设置过期时间）
  const captchaId = Math.random().toString(36).substring(2, 15);
  req.app.get('captchaStore').set(captchaId, captcha.text.toLowerCase());
  
  // 5分钟后过期
  setTimeout(() => {
    req.app.get('captchaStore').delete(captchaId);
  }, 5 * 60 * 1000);
  
  res.type('svg');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  res.status(200).send({
    svg: captcha.data,
    captchaId: captchaId
  });
});

module.exports = router;