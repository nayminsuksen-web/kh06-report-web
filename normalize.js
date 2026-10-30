// จัดรูปแบบเลขบัตร/เบอร์โทรที่ผู้ใช้กรอก
// ต้องตรงกับ normalize_cid / normalize_phone ใน scripts/build_reports.py และ apps-script/Code.js
(function (root) {
  var THAI = "๐๑๒๓๔๕๖๗๘๙";
  var FULL = "０１２３４５６７８９";

  function toAsciiDigits(s) {
    return String(s || "").replace(/[๐-๙０-９]/g, function (c) {
      var i = THAI.indexOf(c);
      return String(i >= 0 ? i : FULL.indexOf(c));
    });
  }

  // '+66 81-234 5678' / '๐๘๑...' → '0812345678'
  function normalizePhone(s) {
    var d = toAsciiDigits(s).replace(/[^0-9]/g, "");
    if (d.indexOf("66") === 0 && (d.length === 10 || d.length === 11)) d = "0" + d.slice(2);
    return d;
  }

  // ตัดช่องว่าง/ขีด/จุด, ตัวพิมพ์ใหญ่ (รองรับเลขเอกสารต่างชาติ)
  function normalizeCid(s) {
    return toAsciiDigits(s).toUpperCase().replace(/[^0-9A-Z]/g, "");
  }

  function isValidPhone(p) {
    return /^0\d{8,9}$/.test(p);
  }

  // เลขบัตรประชาชนไทย 13 หลัก: checksum mod 11
  function thaiCidChecksumOk(c) {
    if (!/^\d{13}$/.test(c)) return false;
    var sum = 0;
    for (var i = 0; i < 12; i++) sum += Number(c[i]) * (13 - i);
    return (11 - (sum % 11)) % 10 === Number(c[12]);
  }

  // คืนข้อความ error (ภาษาไทย) หรือ "" ถ้าผ่าน
  function validateCid(c) {
    if (!c) return "กรุณากรอกเลขบัตรประชาชน";
    if (/^\d{13}$/.test(c)) return thaiCidChecksumOk(c) ? "" : "เลขบัตรประชาชนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
    if (c.length < 6 || c.length > 20) return "เลขบัตรประชาชนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
    return "";
  }

  function validatePhone(p) {
    if (!p) return "กรุณากรอกเบอร์โทรศัพท์";
    return isValidPhone(p) ? "" : "เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง 081-234-5678)";
  }

  var api = {
    normalizePhone: normalizePhone,
    normalizeCid: normalizeCid,
    thaiCidChecksumOk: thaiCidChecksumOk,
    validateCid: validateCid,
    validatePhone: validatePhone,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KH06 = api;
})(this);
