
// Indonesian translations for the application
export const translations = {
  // Navigation & Header
  home: "Beranda",
  projects: "Proyek",
  about: "Tentang",
  contact: "Kontak",
  dashboard: "Dasbor",
  settings: "Pengaturan",
  admin: "Admin",
  login: "Masuk",
  logout: "Keluar",
  
  // Project related
  featuredProjects: "Proyek Unggulan",
  latestProjects: "Proyek Terbaru",
  allProjects: "Semua Proyek",
  addProject: "Tambah Proyek",
  editProject: "Edit Proyek",
  deleteProject: "Hapus Proyek",
  projectTitle: "Judul Proyek",
  projectDescription: "Deskripsi Proyek",
  viewDetails: "Lihat Detail",
  viewAllProjects: "Lihat Semua Proyek",
  noProjectsFound: "Tidak ada proyek ditemukan",
  addFirstProject: "Tambahkan proyek pertama Anda!",
  
  // Form fields
  title: "Judul",
  description: "Deskripsi",
  imageUrl: "URL Gambar",
  tags: "Tag (pisah dengan koma)",
  githubUrl: "URL GitHub",
  liveUrl: "URL Live",
  downloadUrl: "URL Unduh",
  price: "Harga ($)",
  featured: "Proyek Unggulan",
  sourceVisible: "Tampilkan Kode Sumber",
  downloadType: "Jenis Unduhan",
  free: "Gratis",
  paid: "Berbayar",
  
  // Actions
  save: "Simpan",
  cancel: "Batal",
  delete: "Hapus",
  edit: "Edit",
  add: "Tambah",
  update: "Perbarui",
  submit: "Kirim",
  download: "Unduh",
  buy: "Beli",
  
  // Messages
  projectAddedSuccess: "Proyek berhasil ditambahkan!",
  projectUpdatedSuccess: "Proyek berhasil diperbarui!",
  projectDeletedSuccess: "Proyek berhasil dihapus!",
  messageDeletedSuccess: "Pesan berhasil dihapus!",
  settingsUpdatedSuccess: "Pengaturan berhasil diperbarui!",
  
  // Contact form
  name: "Nama",
  email: "Email",
  message: "Pesan",
  phone: "Telepon",
  company: "Perusahaan",
  subject: "Subjek",
  sendMessage: "Kirim Pesan",
  messageSentSuccess: "Pesan berhasil dikirim!",
  
  // About section
  aboutMe: "Tentang Saya",
  profession: "Profesi",
  location: "Lokasi",
  fullName: "Nama Lengkap",
  displayName: "Nama Tampilan",
  
  // Settings
  siteSettings: "Pengaturan Situs",
  siteName: "Nama Situs",
  ownerName: "Nama Pemilik",
  aboutText: "Teks Tentang",
  contactEmail: "Email Kontak",
  phoneNumber: "Nomor Telepon",
  socialLinks: "Tautan Sosial",
  backgroundImage: "Gambar Latar",
  showEducationRoadmap: "Tampilkan Roadmap Pendidikan",
  serverConfiguration: "Konfigurasi Server",
  storageType: "Jenis Penyimpanan",
  serverUrl: "URL Server",
  apiKey: "Kunci API",
  
  // Education
  educationRoadmap: "Roadmap Pendidikan",
  learningJourney: "Perjalanan Belajar",
  progress: "Progress",
  completed: "Selesai",
  inProgress: "Sedang Berlangsung",
  category: "Kategori",
  
  // Skills
  skills: "Keahlian",
  skillName: "Nama Keahlian",
  skillLevel: "Level Keahlian",
  skillCategory: "Kategori Keahlian",
  addSkill: "Tambah Keahlian",
  
  // Messages
  messages: "Pesan",
  unreadMessages: "Pesan Belum Dibaca",
  readMessages: "Pesan Sudah Dibaca",
  markAsRead: "Tandai Sudah Dibaca",
  markAsUnread: "Tandai Belum Dibaca",
  
  // Confirmations
  confirmDelete: "Konfirmasi Hapus",
  confirmDeleteMessage: "Apakah Anda yakin ingin menghapus",
  thisActionCannotBeUndone: "Tindakan ini tidak dapat dibatalkan.",
  
  // Hero section
  heroSubtitle: "Halo, saya",
  heroDescription: "Menciptakan pengalaman digital yang indah dengan perhatian pada detail dan desain yang sempurna.",
  getInTouch: "Hubungi Saya",
  
  // CTA section
  letsWorkTogether: "Mari Bekerja Sama",
  ctaDescription: "Punya proyek dalam pikiran? Saya saat ini tersedia untuk pekerjaan freelance. Mari ciptakan sesuatu yang luar biasa bersama-sama.",
  supportViaSaweria: "Dukung via Saweria",
  
  // Footer
  builtWith: "Dibuat dengan",
  poweredBy: "Didukung oleh",
  
  // File Manager
  files: "File",
  fileManager: "Manajer File",
  uploadFile: "Unggah File",
  downloadFile: "Unduh File",
  
  // Short Links
  shortLinks: "Tautan Pendek",
  createShortLink: "Buat Tautan Pendek",
  originalUrl: "URL Asli",
  shortCode: "Kode Pendek",
  
  // Error messages
  error: "Error",
  notFound: "Tidak Ditemukan",
  pageNotFound: "Halaman tidak ditemukan",
  somethingWentWrong: "Terjadi kesalahan",
  
  // Loading states
  loading: "Memuat...",
  pleaseWait: "Mohon tunggu...",
};

// Hook for using translations
export const useTranslations = () => {
  return translations;
};

export const t = (key: keyof typeof translations): string => {
  return translations[key] || key;
};
