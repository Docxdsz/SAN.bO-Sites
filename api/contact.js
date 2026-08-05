const nodemailer = require('nodemailer');

const TO_EMAIL = 'contato@reservavereda.com.br';
const FROM_NAME = 'Reserva Vereda';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripHeaderInjection(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim();
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { nome, email, perfil, telefone } = req.body || {};

  if (
    !isNonEmptyString(nome, 200) ||
    !isNonEmptyString(email, 200) ||
    !EMAIL_RE.test(email) ||
    !isNonEmptyString(perfil, 100) ||
    !isNonEmptyString(telefone, 50)
  ) {
    return res.status(400).json({ ok: false, error: 'Campos inválidos.' });
  }

  const safeNome = stripHeaderInjection(nome);
  const safeEmail = stripHeaderInjection(email);
  const safePerfil = stripHeaderInjection(perfil);
  const safeTelefone = stripHeaderInjection(telefone);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS environment variables.');
    return res.status(500).json({ ok: false, error: 'Envio não configurado.' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: safeEmail,
      subject: `Novo lead: ${safeNome} (${safePerfil})`,
      text: [
        `Nome: ${safeNome}`,
        `E-mail: ${safeEmail}`,
        `Telefone/WhatsApp: ${safeTelefone}`,
        `Perfil: ${safePerfil}`,
      ].join('\n'),
      html: [
        '<h2>Novo lead — Reserva Vereda</h2>',
        `<p><strong>Nome:</strong> ${safeNome}</p>`,
        `<p><strong>E-mail:</strong> ${safeEmail}</p>`,
        `<p><strong>Telefone/WhatsApp:</strong> ${safeTelefone}</p>`,
        `<p><strong>Perfil:</strong> ${safePerfil}</p>`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Falha ao enviar e-mail:', err);
    return res.status(502).json({ ok: false, error: 'Falha ao enviar e-mail.' });
  }
};
