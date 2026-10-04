// Shared by Express, the static exporter, and the browser.
export function calculateAge(birthDate, now = new Date(), timeZone = 'America/Los_Angeles') {
  if (typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new RangeError('Birth date must use YYYY-MM-DD.');
  }
  const birth = new Date(`${birthDate}T00:00:00Z`);
  if (!Number.isFinite(birth.getTime()) || birth.toISOString().slice(0, 10) !== birthDate) {
    throw new RangeError('Birth date must be a valid calendar date.');
  }
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(now);
  const today = Object.fromEntries(parts.map(({ type, value }) => [type, Number(value)]));
  const beforeBirthday = today.month < birthMonth || (today.month === birthMonth && today.day < birthDay);
  const age = today.year - birthYear - Number(beforeBirthday);
  if (age < 0) throw new RangeError('Birth date must not be in the future.');
  return age;
}
