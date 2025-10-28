export const birthdays = [
  { name: "Nguyễn Thái Ngọc An", date: "2010-05-05" },
  { name: "Lê Hải Anh", date: "2010-11-15" },
  { name: "Trần Xuân Bách", date: "2010-02-10" },
  { name: "Nguyễn Hoàng Thiên Bảo", date: "2010-03-31" },
  { name: "Giang Tuấn Dũng", date: "2010-09-30" },
  { name: "Nguyễn Cao Đạt", date: "2010-04-14" },
  { name: "Huỳnh Ý Định", date: "2010-03-20" },
  { name: "Đoàn Sĩ Đức", date: "2010-12-21" },
  { name: "Phạm Phúc Đức", date: "2010-01-14" },
  { name: "La Tuấn Hảo", date: "2010-04-09" },
  { name: "Nguyễn Trí Hiếu", date: "2010-03-17" },
  { name: "Nguyễn Đức Huy", date: "2010-12-28" },
  { name: "Nguyễn Lê Huy", date: "2010-02-20" },
  { name: "Phạm Nguyễn Tiến Huy", date: "2010-08-09" },
  { name: "Phan Vĩ Khang", date: "2010-01-09" },
  { name: "Tạ Quốc Khang", date: "2010-09-07" },
  { name: "Tiền Đặng Gia Khang", date: "2010-12-16" },
  { name: "Hà Đăng Khoa", date: "2010-03-23" },
  { name: "Lương Phạm Anh Khoa", date: "2010-11-06" },
  { name: "Đồng Minh Khôi", date: "2010-07-28" },
  { name: "Lê Bảo Lâm", date: "2010-05-25" },
  { name: "Đặng Ngọc Liên", date: "2010-01-13" },
  { name: "Dương Ngọc Linh", date: "2010-04-25" },
  { name: "Tô Vĩnh Lương", date: "2010-04-23" },
  { name: "Phạm Quách Lê Minh", date: "2010-03-16" },
  { name: "Cao Gia Mỹ", date: "2010-05-30" },
  { name: "Nguyễn Hoàng Phát", date: "2010-08-23" },
  { name: "Huỳnh Bảo Phong", date: "2010-10-15" },
  { name: "Huỳnh Thục Phương", date: "2010-12-31" },
  { name: "Dương Văn San", date: "2010-11-11" },
  { name: "Hồ Y San", date: "2010-12-06" },
  { name: "Đỗ Minh Sơn", date: "2010-01-19" },
  { name: "Huỳnh Minh Thành", date: "2010-02-26" },
  { name: "Trương Hiệp Thập", date: "2010-03-19" },
  { name: "Huỳnh Mai Thùy", date: "2010-07-22" },
  { name: "Phạm Tài Đình Tiến", date: "2010-11-08" },
  { name: "Phạm Khánh Vân", date: "2010-11-01" },
  { name: "Giang Kiến Vĩ", date: "2010-06-19" },
  { name: "Phan Anh Vũ", date: "2010-02-18" },
  { name: "Lê Hoàng Khánh Vy", date: "2010-04-27" },
  { name: "Trần Khánh Bảo Vy", date: "2010-09-21" },
  { name: "Châu Kim Yến", date: "2010-11-04" }
];

export function renderBirthdays() {
  return `<div class='card'><h2>🎂 Danh sách sinh nhật</h2>${
    birthdays.map(b => `<p>🎉 ${b.name} - ${b.date}</p>`).join("")
  }</div>`;
}

export function checkBirthday() {
  const today = new Date().toISOString().slice(5,10);
  birthdays.forEach(b => {
    if (b.date.slice(5) === today) {
      alert(`🎉 Hôm nay là sinh nhật của ${b.name}!`);
      new Audio("happy-birthday.mp3").play();
    }
  });
}
