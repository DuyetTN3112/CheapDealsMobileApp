type TranslationKeys = {
    [key: string]: string;
  };
  
  type Translations = {
    [language: string]: TranslationKeys;
  };
  
  const translations: Translations = {
    en: {
      // Common
      "app.name": "CheapDeals",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.submit": "Submit",
      "common.continue": "Continue",
      "common.back": "Back",
      "common.next": "Next",
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.warning": "Warning",
      "common.info": "Information",
      
      // Auth
      "auth.login": "Log In",
      "auth.register": "Register",
      "auth.logout": "Log Out",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.forgotPassword": "Forgot Password?",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      
      // Tabs
      "tabs.home": "Home",
      "tabs.packages": "Packages",
      "tabs.support": "Support",
      "tabs.account": "Account",
      
      // Packages
      "packages.title": "Packages",
      "packages.popular": "Popular",
      "packages.details": "Package Details",
      "packages.features": "Package Features",
      "packages.order": "Order Now",
      "packages.addToCart": "Add to Cart",
      "packages.promo": "Have a Promo Code?",
      "packages.apply": "Apply",
      "packages.myPackages": "My Packages",
      "packages.managePackages": "Manage Packages",
      "packages.upgradePackage": "Upgrade Package",
      "packages.cancelPackage": "Cancel Package",
      
      // Account
      "account.title": "My Account",
      "account.personalInfo": "Personal Information",
      "account.paymentMethods": "Payment Methods",
      "account.billingHistory": "Billing History",
      "account.notifications": "Notifications",
      "account.privacy": "Privacy & Security",
      "account.appSettings": "App Settings",
      "account.help": "Help & Support",
      "account.logout": "Log Out",
      
      // Support
      "support.title": "Customer Support",
      "support.subtitle": "How can we help you today?",
      "support.sendEnquiry": "Send Enquiry",
      "support.callUs": "Call Us",
      "support.email": "Email",
      "support.faq": "FAQ",
      "support.yourEnquiries": "Your Enquiries",
      "support.submitEnquiry": "Submit an Enquiry",
      "support.subject": "Subject",
      "support.message": "Message",
      "support.chatWithUs": "Chat with us",
      
      // Feedback
      "feedback.title": "Feedback & Ratings",
      "feedback.subtitle": "Help us improve our service",
      "feedback.rating": "Your Rating",
      "feedback.comment": "Your Feedback",
      "feedback.submitFeedback": "Submit Feedback",
      "feedback.thankYou": "Thank you for your feedback!",
      "feedback.serviceRating": "Service Rating",
      "feedback.appRating": "App Rating",
      "feedback.packageRating": "Package Rating",
      
      // Settings
      "settings.title": "App Settings",
      "settings.theme": "Theme",
      "settings.language": "Language",
      "settings.notifications": "Notifications",
      "settings.biometrics": "Biometrics",
      "settings.autoLogin": "Auto Login",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.theme.system": "System Default",
      "settings.version": "App Version",
      "settings.build": "Build",
      
      // Home
      "home.welcome": "Welcome to CheapDeals",
      "home.chatAssistant": "Chat Assistant",
      
      // Packages
      "packages.chatAssistant": "Need Help with Packages?",
      
      // Settings
      "settings.appearance": "Appearance",
      "settings.darkMode": "Dark Mode",
      
      // Chat
      "chat.placeholder": "Type your message...",
      "chat.send": "Send",
      "chat.botResponse": "I'm your assistant. How can I help you today?",
      
      // Password
      "password.change": "Change Password",
      "password.current": "Current Password",
      "password.new": "New Password",
      "password.confirm": "Confirm New Password",
      "password.submit": "Change Password",
      "password.success": "Your password has been successfully changed",
      "password.error": "Failed to change password",
      "password.description": "To change your password, please enter your current password and then your new password.",
      "password.currentRequired": "Current password is required",
      "password.newRequired": "New password is required",
      "password.confirmRequired": "Please confirm your new password",
      "password.length": "Password must be at least 8 characters",
      "password.match": "Passwords do not match",
      
      // Google Auth
      "google.defaultPassword": "Your Google account has been set up with a default password: %s",
      "google.passwordInfo": "Default Password Info",
    },
    
    vi: {
      // Common
      "app.name": "CheapDeals",
      "common.cancel": "Hủy",
      "common.save": "Lưu",
      "common.delete": "Xóa",
      "common.edit": "Sửa",
      "common.submit": "Gửi",
      "common.continue": "Tiếp tục",
      "common.back": "Quay lại",
      "common.next": "Tiếp",
      "common.loading": "Đang tải...",
      "common.error": "Lỗi",
      "common.success": "Thành công",
      "common.warning": "Cảnh báo",
      "common.info": "Thông tin",
      
      // Auth
      "auth.login": "Đăng nhập",
      "auth.register": "Đăng ký",
      "auth.logout": "Đăng xuất",
      "auth.email": "Email",
      "auth.password": "Mật khẩu",
      "auth.forgotPassword": "Quên mật khẩu?",
      "auth.noAccount": "Chưa có tài khoản?",
      "auth.hasAccount": "Đã có tài khoản?",
      
      // Tabs
      "tabs.home": "Trang chủ",
      "tabs.packages": "Gói dịch vụ",
      "tabs.support": "Hỗ trợ",
      "tabs.account": "Tài khoản",
      
      // Packages
      "packages.title": "Gói dịch vụ",
      "packages.popular": "Phổ biến",
      "packages.details": "Chi tiết gói",
      "packages.features": "Tính năng gói",
      "packages.order": "Đặt hàng ngay",
      "packages.addToCart": "Thêm vào giỏ hàng",
      "packages.promo": "Bạn có mã giảm giá?",
      "packages.apply": "Áp dụng",
      "packages.myPackages": "Gói dịch vụ của tôi",
      "packages.managePackages": "Quản lý gói dịch vụ",
      "packages.upgradePackage": "Nâng cấp gói",
      "packages.cancelPackage": "Hủy gói",
      
      // Account
      "account.title": "Tài khoản của tôi",
      "account.personalInfo": "Thông tin cá nhân",
      "account.paymentMethods": "Phương thức thanh toán",
      "account.billingHistory": "Lịch sử thanh toán",
      "account.notifications": "Thông báo",
      "account.privacy": "Quyền riêng tư & Bảo mật",
      "account.appSettings": "Cài đặt ứng dụng",
      "account.help": "Trợ giúp & Hỗ trợ",
      "account.logout": "Đăng xuất",
      
      // Support
      "support.title": "Hỗ trợ khách hàng",
      "support.subtitle": "Chúng tôi có thể giúp gì cho bạn?",
      "support.sendEnquiry": "Gửi yêu cầu",
      "support.callUs": "Gọi cho chúng tôi",
      "support.email": "Email",
      "support.faq": "Câu hỏi thường gặp",
      "support.yourEnquiries": "Yêu cầu của bạn",
      "support.submitEnquiry": "Gửi yêu cầu",
      "support.subject": "Tiêu đề",
      "support.message": "Nội dung",
      "support.chatWithUs": "Trò chuyện với chúng tôi",
      
      // Feedback
      "feedback.title": "Đánh giá & Phản hồi",
      "feedback.subtitle": "Giúp chúng tôi cải thiện dịch vụ",
      "feedback.rating": "Đánh giá của bạn",
      "feedback.comment": "Phản hồi của bạn",
      "feedback.submitFeedback": "Gửi phản hồi",
      "feedback.thankYou": "Cảm ơn phản hồi của bạn!",
      "feedback.serviceRating": "Đánh giá dịch vụ",
      "feedback.appRating": "Đánh giá ứng dụng",
      "feedback.packageRating": "Đánh giá gói dịch vụ",
      
      // Settings
      "settings.title": "Cài đặt ứng dụng",
      "settings.theme": "Giao diện",
      "settings.language": "Ngôn ngữ",
      "settings.notifications": "Thông báo",
      "settings.biometrics": "Sinh trắc học",
      "settings.autoLogin": "Tự động đăng nhập",
      "settings.theme.light": "Sáng",
      "settings.theme.dark": "Tối",
      "settings.theme.system": "Mặc định hệ thống",
      "settings.version": "Phiên bản",
      "settings.build": "Bản dựng",
      
      // Home
      "home.welcome": "Chào mừng đến với CheapDeals",
      "home.chatAssistant": "Trợ lý trò chuyện",
      
      // Packages
      "packages.chatAssistant": "Cần hỗ trợ về gói dịch vụ?",
      
      // Settings
      "settings.appearance": "Giao diện",
      "settings.darkMode": "Chế độ tối",
      
      // Chat
      "chat.placeholder": "Nhập tin nhắn của bạn...",
      "chat.send": "Gửi",
      "chat.botResponse": "Tôi là trợ lý của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
      
      // Password
      "password.change": "Đổi mật khẩu",
      "password.current": "Mật khẩu hiện tại",
      "password.new": "Mật khẩu mới",
      "password.confirm": "Nhập lại mật khẩu mới",
      "password.submit": "Đổi mật khẩu",
      "password.success": "Mật khẩu của bạn đã được thay đổi thành công",
      "password.error": "Không thể thay đổi mật khẩu",
      "password.description": "Để thay đổi mật khẩu, vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.",
      "password.currentRequired": "Vui lòng nhập mật khẩu hiện tại",
      "password.newRequired": "Vui lòng nhập mật khẩu mới",
      "password.confirmRequired": "Vui lòng xác nhận mật khẩu mới",
      "password.length": "Mật khẩu phải có ít nhất 8 ký tự",
      "password.match": "Mật khẩu không khớp",
      
      // Google Auth
      "google.defaultPassword": "Tài khoản Google của bạn đã được thiết lập với mật khẩu mặc định: %s",
      "google.passwordInfo": "Thông tin mật khẩu mặc định",
    },
    
    fr: {
      // Common
      "app.name": "CheapDeals",
      "common.cancel": "Annuler",
      "common.save": "Enregistrer",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.submit": "Soumettre",
      "common.continue": "Continuer",
      "common.back": "Retour",
      "common.next": "Suivant",
      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.success": "Succès",
      "common.warning": "Avertissement",
      "common.info": "Information",
      
      // Auth
      "auth.login": "Connexion",
      "auth.register": "S'inscrire",
      "auth.logout": "Déconnexion",
      "auth.email": "Email",
      "auth.password": "Mot de passe",
      "auth.forgotPassword": "Mot de passe oublié?",
      "auth.noAccount": "Pas de compte?",
      "auth.hasAccount": "Déjà un compte?",
      
      // Tabs
      "tabs.home": "Accueil",
      "tabs.packages": "Forfaits",
      "tabs.support": "Support",
      "tabs.account": "Compte",
      
      // Packages
      "packages.title": "Forfaits",
      "packages.popular": "Populaire",
      "packages.details": "Détails du forfait",
      "packages.features": "Caractéristiques",
      "packages.order": "Commander",
      "packages.addToCart": "Ajouter au panier",
      "packages.promo": "Code promo?",
      "packages.apply": "Appliquer",
      "packages.myPackages": "Mes forfaits",
      "packages.managePackages": "Gérer les forfaits",
      "packages.upgradePackage": "Améliorer le forfait",
      "packages.cancelPackage": "Annuler le forfait",
      
      // Settings
      "settings.title": "Paramètres",
      "settings.theme": "Thème",
      "settings.language": "Langue",
      "settings.notifications": "Notifications",
      "settings.biometrics": "Biométrie",
      "settings.autoLogin": "Connexion auto",
      "settings.theme.light": "Clair",
      "settings.theme.dark": "Sombre",
      "settings.theme.system": "Système",
      "settings.version": "Version",
      "settings.build": "Build",
    },
    
    // Add more languages as needed
  };
  
  export default translations;