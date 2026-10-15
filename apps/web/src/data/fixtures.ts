// Fixture data lifted from the design export; swap for the API client once P4-01..03 land.
export const DETAIL_EVENT_ID = "VN-2023-8841";

export type EventItem = {
  id: string;
  topic: string;
  location: string;
  ward?: string;
  ambiguous?: boolean;
  time: string;
  title: string;
  excerpt: string;
  sources: string[];
};

export const TOPICS = ["Economy", "Infrastructure", "Technology", "Environment", "Society"] as const;
export const LOCATIONS = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"] as const;
export const SOURCE_NAMES = ["VnExpress", "Tuổi Trẻ", "Thanh Niên", "VietnamPlus", "Hà Nội Mới"] as const;

export const EVENTS: EventItem[] = [
  {
    id: DETAIL_EVENT_ID, topic: "Infrastructure", location: "Hà Nội", ward: "Ba Đình / Tây Hồ", time: "Today, 08:30 GMT+7",
    title: "Hà Nội approves expansion plan for Metro Line 2 connection corridors",
    excerpt: "City authorities finalize site clearance milestones and technical standards for the 11.5km urban railway segment linking Nam Thăng Long and Trần Hưng Đạo.",
    sources: ["VnExpress", "Tuổi Trẻ", "Hà Nội Mới", "VietnamNet", "Lao Động"],
  },
  {
    id: "VN-2023-8790", topic: "Economy", location: "TP. Hồ Chí Minh", ward: "Quận 1", time: "Yesterday, 16:45 GMT+7",
    title: "State Bank branch issues foreign exchange liquidity guideline for regional export hubs",
    excerpt: "Commercial banks in southern economic zone instructed to support high-priority agricultural and manufacturing export credit lines.",
    sources: ["Tuổi Trẻ", "Thanh Niên", "Đầu Tư", "Saigon Times"],
  },
  {
    id: "VN-2023-8772", topic: "Environment", location: "Multi-province / Central Coast", ambiguous: true, time: "Yesterday, 11:20 GMT+7",
    title: "Tropical depression intensifies off central coast, prompting coastal advisory across 4 provinces",
    excerpt: "National Center for Hydro-Meteorological Forecasting issues gale warnings from Quảng Trị to Quảng Ngãi. Local response teams mobilize maritime fleet tracking and reservoir discharge checks.",
    sources: ["VietnamPlus", "VTV News", "Tuổi Trẻ", "Dân Trí", "Tiền Phong", "Nhân Dân"],
  },
  {
    id: "VN-2023-8731", topic: "Technology", location: "Đà Nẵng", ward: "Hòa Vang Hi-tech Park", time: "May 12, 14:10 GMT+7",
    title: "Semiconductor design center officially breaks ground with university engineering consortium",
    excerpt: "The 1.8-hectare testing and packaging research facility aims to train over 1,200 specialized integrated circuit engineers annually in collaboration with regional technology universities.",
    sources: ["Thanh Niên", "VnExpress", "Đà Nẵng News"],
  },
  {
    id: "VN-2023-8702", topic: "Society", location: "Cần Thơ", ward: "Ninh Kiều", time: "May 11, 09:15 GMT+7",
    title: "Mekong River delta flood mitigation conference convenes regional municipal leadership",
    excerpt: "Provincial authorities debate long-term saline intrusion barriers and tidal barrage infrastructure allocations to safeguard downstream drinking water reservoirs across 13 provinces.",
    sources: ["Tuổi Trẻ", "VnExpress", "Báo Cần Thơ", "VietnamPlus"],
  },
];

export const DETAIL = {
  id: DETAIL_EVENT_ID,
  category: "Hạ tầng giao thông",
  topicTag: "Hạ tầng kỹ thuật",
  location: "Hà Nội (Ba Đình / Tây Hồ / Hoàn Kiếm, Việt Nam)",
  updated: "Cập nhật lúc 10:15 GMT+7 · Khởi phát 08:30 GMT+7",
  title: "Hà Nội phê duyệt kế hoạch hạ tầng kết nối hành lang tuyến Metro số 2 Nam Thăng Long - Trần Hưng Đạo",
  lead: "Hồ sơ tổng hợp quá trình tiếp nhận và phân định nguồn tin về công tác giải phóng mặt bằng depot Xuân Đỉnh, thiết kế không gian hầm trung chuyển ngầm và dự toán tiến độ đấu thầu xây dựng theo thông cáo báo chí chính thức từ các cơ quan ngôn luận.",
  items: [
    { time: "08:30", kind: "Bản tin mở đầu", outlet: "Báo VnExpress", title: "Hà Nội chốt tiến độ bàn giao mặt bằng tuyến metro Nam Thăng Long - Trần Hưng Đạo", body: "UBND Thành phố ban hành công điện khẩn đốc thúc hoàn tất thu hồi đất khu vực depot Xuân Đỉnh (3,2 ha) thuộc quận Bắc Từ Liêm và Tây Hồ trước ngày 30/11.", note: "Khớp cụm: Trùng khớp 100% tọa độ định danh", entities: "Depot Xuân Đỉnh, Ga C1 (Bắc Từ Liêm)", host: "VnExpress" },
    { time: "08:45", kind: "Đối chiếu đơn giá", outlet: "Báo Tuổi Trẻ", title: "Đẩy nhanh giải phóng mặt bằng metro số 2 qua các quận trung tâm", body: "Bài viết phản ánh hệ số điều chỉnh giá đất đền bù cho các hộ dân chịu ảnh hưởng hành lang ngầm đoạn qua nút giao Hàng Giấy - Hàng Đậu (Hoàn Kiếm) và Quán Thánh (Ba Đình).", note: "Cập nhật: 15 phút sau tin đầu", entities: "Nút giao Hàng Đậu, Quán Thánh, Phan Đình Phùng", host: "TuoiTre.vn" },
    { time: "09:10", kind: "Văn bản hành chính", outlet: "Báo Hà Nội Mới", title: "UBND thành phố Hà Nội phê duyệt kế hoạch hạ tầng kết nối các nhà ga ngầm tuyến 2", body: "Công bố chi tiết quy hoạch hành lang hầm bộ hành nối từ ga ngầm C9 sang khu vực phụ cận hồ Hoàn Kiếm và ga trung chuyển C8 công viên Bách Thảo.", note: "Nguồn công báo: Sở Quy hoạch - Kiến trúc", entities: "Ga ngầm C9 (Bờ hồ Hoàn Kiếm), Ga C8 (Bách Thảo)", host: "Hanoimoi.vn" },
    { time: "09:40", kind: "Lộ trình kỹ thuật", outlet: "Báo VietnamNet", title: "Tuyến metro số 2 Hà Nội: Dự kiến khởi công đoạn đi ngầm vào quý 3", body: "Ban Quản lý Đường sắt đô thị Hà Nội (MRB) rà soát điều chỉnh tổng mức đầu tư và hoàn thiện đàm phán hợp đồng tư vấn thiết kế kỹ thuật tuyến chính.", note: "Tiến độ nhà thầu: Gói thầu CP01 / CP02", entities: "Ban Quản lý MRB Hà Nội, Trục Trần Hưng Đạo", host: "VietnamNet.vn" },
    { time: "10:15", kind: "Ghi nhận thực tế", outlet: "Báo Lao Động", title: "Ý kiến người dân quanh dự án tuyến đường sắt đô thị số 2 Hà Nội", body: "Khảo sát ý kiến cư dân tại khu đô thị Ciputra và trục đường Thụy Khuê về công tác phân luồng giao thông thử nghiệm và bảo vệ công trình cổ thụ xung quanh hồ Tây.", note: "Khảo sát địa bàn dân cư", entities: "Phường Thụy Khuê, Khu đô thị Nam Thăng Long", host: "LaoDong.vn" },
  ],
  places: [
    ["Depot Xuân Đỉnh", "Bắc Từ Liêm"],
    ["Ga C8 (Công viên Bách Thảo)", "Hoàn Kiếm"],
    ["Ga ngầm C9 (Hồ Gươm)", "Hoàn Kiếm"],
    ["Hành lang Thụy Khuê - Hoàng Hoa Thám", "Tây Hồ"],
  ],
};

export type Outlet = { code: string; name: string; owner: string; beat: string; sub: string; format: string; focus: string; cadence: string; cat: string; wire?: boolean };
export const OUTLETS: Outlet[] = [
  { code: "VX", name: "VnExpress", owner: "FPT Online", beat: "General & National News", sub: "Current affairs, society, science", format: "Public RSS 2.0", focus: "Nationwide", cadence: "Every 5m", cat: "general" },
  { code: "TT", name: "Tuổi Trẻ Online", owner: "Thành Đoàn TP.HCM", beat: "Society, Urban & National", sub: "Civic reporting, urban affairs", format: "Editorial Feed API", focus: "South & Nationwide", cadence: "Every 10m", cat: "general" },
  { code: "TN", name: "Thanh Niên", owner: "Hội Liên hiệp Thanh niên VN", beat: "General, Youth & Society", sub: "Social welfare, education, lifestyle", format: "Public RSS 2.0", focus: "Nationwide", cadence: "Every 10m", cat: "general" },
  { code: "TX", name: "VietnamPlus (TTXVN)", owner: "Thông tấn xã Việt Nam", beat: "Official National News Agency", sub: "Diplomacy, governance, gazette", format: "National Wire API", focus: "Domestic & International", cadence: "Continuous", cat: "wire", wire: true },
  { code: "HN", name: "Hà Nội Mới", owner: "Thành ủy Hà Nội", beat: "Municipal & Northern Region", sub: "Capital urban planning, districts", format: "RSS 2.0 Feed", focus: "Hà Nội & Northern Delta", cadence: "Every 15m", cat: "regional" },
  { code: "CT", name: "Báo Cần Thơ", owner: "Thành ủy Cần Thơ", beat: "Regional & Agricultural", sub: "Mekong waterway, regional trade", format: "RSS 2.0 Feed", focus: "Mekong Delta", cadence: "Every 15m", cat: "regional" },
  { code: "ST", name: "Saigon Times", owner: "UBND TP.HCM", beat: "Business & Economy", sub: "Macro-fiscal policy, exports, finance", format: "RSS 2.0 Feed", focus: "Economic Hubs (HCMC / HN)", cadence: "Every 10m", cat: "business" },
  { code: "LĐ", name: "Lao Động", owner: "Tổng Liên đoàn Lao động VN", beat: "Labor, Legal & Society", sub: "Industrial zones, legal rights, policy", format: "Public RSS 2.0", focus: "Nationwide", cadence: "Every 10m", cat: "general" },
  { code: "TP", name: "Tiền Phong", owner: "Trung ương Đoàn TNCS HCM", beat: "General & Investigation", sub: "Public interest, youth activism", format: "Public RSS 2.0", focus: "Nationwide", cadence: "Every 10m", cat: "general" },
  { code: "ĐN", name: "Báo Đà Nẵng", owner: "Thành ủy Đà Nẵng", beat: "Regional & Municipal", sub: "Central coast economy, port development", format: "RSS 2.0 Feed", focus: "Central Coast & Đà Nẵng", cadence: "Every 15m", cat: "regional" },
];

export type Result = { id: string; topic: string; location: string; time: string; title: string; excerpt: string; label: string; sources: string[]; badge: string; province: string; theme: string; days: number };
export const RESULTS: Result[] = [
  { id: DETAIL_EVENT_ID, topic: "Hạ tầng & Giao thông", location: "Hà Nội (Ba Đình / Tây Hồ)", time: "2 giờ trước (14:30 ICT)", title: "Hà Nội thông qua quy hoạch hành lang kết nối phụ trợ cho tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo)", excerpt: "UBND Thành phố Hà Nội vừa chính thức phê duyệt chỉ giới đường đỏ và phương án hướng tuyến đoạn nối các ga ngầm dọc hành lang Hồ Tây, bảo đảm mặt bằng thi công công trình đường sắt đô thị trọng điểm trong quý IV.", label: "nguồn báo cáo", sources: ["VnExpress", "Tuổi Trẻ", "Hà Nội Mới", "VietnamNet", "Lao Động"], badge: "Xem cây sự kiện", province: "Hà Nội", theme: "Hạ tầng & Giao thông", days: 1 },
  { id: "VN-2023-8650", topic: "Hạ tầng & Vận tải", location: "Hà Nội (Hà Đông / Đống Đa / Cát Linh)", time: "18 Tháng 10, 2023", title: "Đường sắt đô thị Cát Linh - Hà Đông cán mốc 15 triệu lượt hành khách, duy trì tỷ lệ đúng giờ 99.8%", excerpt: "Hanoi Metro công bố sản lượng hành khách toàn tuyến 2A vượt chỉ tiêu đề ra sau gần 2 năm vận hành thương mại. Tỷ lệ người dân lựa chọn vé tháng thường xuyên chiếm hơn 60%, góp phần giảm tải áp lực ùn tắc cục bộ trên trục đường Nguyễn Trãi - Quang Trung.", label: "nguồn đồng quy", sources: ["Tuổi Trẻ", "Thanh Niên", "VietnamPlus", "Tiền Phong"], badge: "Dữ liệu lưu lượng mở", province: "Hà Nội", theme: "Hạ tầng & Giao thông", days: 12 },
  { id: "VN-2023-8611", topic: "Dự án Quốc gia", location: "Hà Nội (Nam Từ Liêm / Cầu Giấy)", time: "12 Tháng 10, 2023", title: "Đoạn trên cao Metro Nhổn - Ga Hà Nội hoàn tất kiểm định an toàn kỹ thuật, bước vào nghiệm thu cuối cùng", excerpt: "Ban Quản lý Đường sắt Đô thị Hà Nội (MRB) cùng liên danh tư vấn quốc tế Systra đã thực hiện các bài chạy thử nghiệm tích hợp hệ thống 8,5km đoạn trên cao. Các tiêu chuẩn về gia tốc, phanh hãm và phòng cháy chữa cháy ga trên cao đều đạt chuẩn an toàn châu Âu EN 50126.", label: "nguồn kiểm chứng", sources: ["VnExpress", "VTV News", "Tuổi Trẻ", "Lao Động", "Dân Trí", "Tiền Phong"], badge: "Chứng thư an toàn EN50126", province: "Hà Nội", theme: "Quy hoạch Đô thị", days: 25 },
];
