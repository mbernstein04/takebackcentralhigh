const FORM_NAME = 'central-high-supporter';

exports.handler = async function () {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;
  if (!token || !siteId) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID' }) };
  }
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Netlify API returned ${res.status}`);
    const forms = await res.json();
    const form = forms.find(function (f) { return f.name === FORM_NAME; });
    const count = form ? form.submission_count : 0;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60, s-maxage=60' }, body: JSON.stringify({ count: count }) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
  }
};
