import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie'],
    },
    resources: {
      en: {
        translation: {
          // Common terms
          welcome: 'Welcome',
          hello: 'Hello',
          
          // App name
          appName: 'YUMRUSH',
          
          // Food categories
          Pizza: 'Pizza',
          Burger: 'Burger',
          Pasta: 'Pasta',
          Salad: 'Salad',
          Dessert: 'Dessert',
          Drink: 'Drink',
          Fries: 'Fries',
          
          // Product names
          Margherita: 'Margherita',
          Pepperoni: 'Pepperoni',
          Hawaiian: 'Hawaiian',
          Veggie: 'Veggie',
          'Classic Fries': 'Classic Fries',
          'Sweet Potato Fries': 'Sweet Potato Fries',
          'Four Seasons': 'Four Seasons',
          'Classic Burger': 'Classic Burger',
          'Cheese Burger': 'Cheese Burger',
          
          // Header & Navigation
          MENU: 'MENU',
          ABOUT: 'ABOUT',
          CONTACT: 'CONTACT',
          ADMIN: 'ADMIN',
          searchPlaceholder: 'Search products...',
          foodCategories: 'Food Categories',
          notifications: 'Notifications',
          noNotifications: 'No notifications',
          markAllAsRead: 'Mark all as read',
          
          // User profile
          Profile: 'Profile',
          'My Orders': 'My Orders',
          Settings: 'Settings',
          Dashboard: 'Dashboard',
          Products: 'Products',
          Orders: 'Orders',
          Users: 'Users',
          Admin: 'Admin',
          
          // Admin Dashboard
          adminDashboard: 'Admin Dashboard',
          manageYourStore: 'Manage your store',
          ordersManagement: 'Orders Management',
          viewAndManageOrders: 'View and manage all customer orders',
          productManagement: 'Product Management',
          userManagement: 'User Management',
          viewAndManageAllUsers: 'View and manage all users',
          dashboardOverview: 'Overview of your business performance',
          ordersSummary: 'Orders Summary',
          usersSummary: 'Users Summary',
          productsSummary: 'Products Summary',
          totalOrders: 'Total Orders',
          totalRevenue: 'Total Revenue',
          totalUsers: 'Total Users',
          totalProducts: 'Total Products',
          productsByCategory: 'Products by Category',
          quickActions: 'Quick Actions',
          addNewProduct: 'Add New Product',
          processOrders: 'Process Orders',
          manageUsers: 'Manage Users',
          viewAll: 'View All',
          loading: 'Loading',
          
          // Order status translations
          pending: 'Pending',
          processing: 'Processing',
          ready: 'Ready',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
          
          // Orders table
          orderId: 'Order ID',
          date: 'Date',
          customer: 'Customer',
          total: 'Total',
          status: 'Status',
          actions: 'Actions',
          view: 'View',
          markDelivered: 'Mark Delivered',
          
          // Order details modal
          orderDetails: 'Order Details',
          customerInformation: 'Customer Information',
          name: 'Name',
          email: 'Email',
          orderInformation: 'Order Information',
          paid: 'Paid',
          yes: 'Yes',
          no: 'No',
          paidAt: 'Paid At',
          deliveredAt: 'Delivered At',
          orderItems: 'Order Items',
          product: 'Product',
          quantity: 'Quantity',
          price: 'Price',
          allOrders: 'All Orders',
          noOrdersFound: 'No orders found',
          
          // Cart
          yourCart: 'Your Cart',
          emptyCart: 'Your cart is empty',
          continueShopping: 'Continue Shopping',
          remove: 'Remove',
          subtotal: 'Subtotal',
          totalAmount: 'Total',
          proceedToCheckout: 'Proceed to Checkout',
          clearCart: 'Clear Cart',
          pleaseLoginToCheckout: 'Please log in to checkout',
          processingPayment: 'Processing...',
          completeDeliveryAddress: 'Please complete your delivery address in Profile Settings',
          goToProfileSettings: 'Go to Profile Settings',
          add: 'Add',
          
          // Auth
          welcomeToYumrush: 'Welcome to YUMRUSH',
          Login: 'Login',
          Register: 'Register',
          fullName: 'Full Name',
          emailAddress: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          enterYourName: 'Enter your name',
          enterYourEmail: 'Enter your email',
          enterYourPassword: 'Enter your password',
          confirmYourPassword: 'Confirm your password',
          pleaseWait: 'Please wait...',
          signIn: 'Sign In',
          createAccount: 'Create Account',
          dontHaveAccount: 'Don\'t have an account?',
          registerNow: 'Register now',
          alreadyHaveAccount: 'Already have an account?',
          signUp: 'Sign Up',
          
          // Errors
          fillAllFields: 'Please fill in all fields',
          enterName: 'Please enter your name',
          passwordsDontMatch: 'Passwords do not match',
          passwordMinLength: 'Password must be at least 6 characters',
          
          // UI elements
          addToCart: 'Add to Cart',
          viewCart: 'View Cart',
          checkout: 'Checkout',
          search: 'Search',
          menu: 'Menu',
          profile: 'Profile',
          logout: 'Logout',
          login: 'Login',
          register: 'Register',
          close: 'Close',
          
          // Time and preparation
          preparationTime: 'Preparation Time',
          minutes: 'minutes',
          
          // No results
          noProductsFound: 'No {{category}} products found',
          loadingMoreProducts: 'Loading more products...',
          
          // Success/Errors
          errorProcessingPayment: 'There was an error processing your payment. Please try again.',
          
          // Cookie consent
          cookieTitle: 'We use cookies',
          cookieText: 'We use cookies to improve your experience on our site. Some cookies are necessary for the site to function, while others help us improve your experience.',
          privacyPolicy: 'Privacy Policy',
          acceptAll: 'Accept All',
          acceptEssential: 'Only Essential',
          
          // About page
          aboutYumRush: 'About YumRush',
          ourStory: 'Our Story',
          ourStoryText: 'Founded in 2024, YumRush was born from a simple idea: delivering exceptional food without the long wait. We believe that delicious meals should be accessible to everyone, whenever hunger strikes.',
          ourMission: 'Our Mission',
          ourMissionText: 'At YumRush, our mission is to connect hungry customers with their favorite local restaurants, providing a seamless ordering experience and lightning-fast delivery. We\'re passionate about supporting local businesses while satisfying cravings.',
          qualityPromise: 'Quality Promise',
          qualityPromiseText: 'We partner only with restaurants that share our commitment to quality ingredients, exceptional taste, and responsible food handling. When you order through YumRush, you can expect nothing but the best.',
          joinOurTeam: 'Join Our Team',
          joinOurTeamText: 'We\'re always looking for passionate people to join our growing team. Whether you\'re a developer, customer service specialist, or delivery driver, we\'d love to hear from you. Check our careers page for current opportunities.',
          
          // Contact page
          contactUs: 'Contact Us',
          customerService: 'Customer Service',
          customerServiceText: 'Have a question about your order?',
          email: 'Email',
          phone: 'Phone',
          hours: 'Hours',
          businessInquiries: 'Business Inquiries',
          businessInquiriesText: 'Interested in partnering with YumRush?',
          mainOffice: 'Main Office',
          yourName: 'Your Name',
          emailAddress: 'Email Address',
          subject: 'Subject',
          selectSubject: 'Select a subject',
          orderIssue: 'Order Issue',
          accountQuestion: 'Account Question',
          restaurantPartnership: 'Restaurant Partnership',
          generalFeedback: 'General Feedback',
          other: 'Other',
          yourMessage: 'Your Message',
          sending: 'Sending...',
          sendMessage: 'Send Message',
          thankYouMessage: 'Thank you for your message!',
          messageReceivedText: 'We\'ve received your inquiry and will get back to you within 24 hours.',
          sendAnotherMessage: 'Send another message'
        }
      },
      cz: {
        translation: {
          // Common terms
          welcome: 'Vítejte',
          hello: 'Ahoj',
          
          // App name
          appName: 'YUMRUSH',
          
          // Food categories
          Pizza: 'Pizza',
          Burger: 'Hamburger',
          Pasta: 'Těstoviny',
          Salad: 'Salát',
          Dessert: 'Dezert',
          Drink: 'Nápoj',
          Fries: 'Hranolky',
          
          // Product names
          Margherita: 'Margherita',
          Pepperoni: 'Pepperoni',
          Hawaiian: 'Havajská',
          Veggie: 'Zeleninová',
          'Classic Fries': 'Klasické hranolky',
          'Sweet Potato Fries': 'Hranolky ze sladkých brambor',
          'Four Seasons': 'Čtyři roční období',
          'Classic Burger': 'Klasický burger',
          'Cheese Burger': 'Sýrový burger',
          
          // Header & Navigation
          MENU: 'MENU',
          ABOUT: 'O NÁS',
          CONTACT: 'KONTAKT',
          ADMIN: 'ADMIN',
          searchPlaceholder: 'Hledat produkty...',
          foodCategories: 'Kategorie jídla',
          notifications: 'Oznámení',
          noNotifications: 'Žádná oznámení',
          markAllAsRead: 'Označit vše jako přečtené',
          
          // User profile
          Profile: 'Profil',
          'My Orders': 'Moje objednávky',
          Settings: 'Nastavení',
          Dashboard: 'Přehled',
          Products: 'Produkty',
          Orders: 'Objednávky',
          Users: 'Uživatelé',
          Admin: 'Admin',
          
          // Admin Dashboard
          adminDashboard: 'Administrátorský panel',
          manageYourStore: 'Správa vašeho obchodu',
          ordersManagement: 'Správa objednávek',
          viewAndManageOrders: 'Zobrazit a spravovat všechny objednávky zákazníků',
          productManagement: 'Správa produktů',
          userManagement: 'Správa uživatelů',
          viewAndManageAllUsers: 'Zobrazit a spravovat všechny uživatele',
          dashboardOverview: 'Přehled výkonu vašeho podnikání',
          ordersSummary: 'Shrnutí objednávek',
          usersSummary: 'Shrnutí uživatelů',
          productsSummary: 'Shrnutí produktů',
          totalOrders: 'Celkem objednávek',
          totalRevenue: 'Celkové tržby',
          totalUsers: 'Celkem uživatelů',
          totalProducts: 'Celkem produktů',
          productsByCategory: 'Produkty podle kategorie',
          quickActions: 'Rychlé akce',
          addNewProduct: 'Přidat nový produkt',
          processOrders: 'Zpracovat objednávky',
          manageUsers: 'Spravovat uživatele',
          viewAll: 'Zobrazit vše',
          loading: 'Načítání',
          
          // Order status translations
          pending: 'Čeká na vyřízení',
          processing: 'Zpracovává se',
          ready: 'Připraveno',
          delivered: 'Doručeno',
          cancelled: 'Zrušeno',
          
          // Orders table
          orderId: 'ID objednávky',
          date: 'Datum',
          customer: 'Zákazník',
          total: 'Celkem',
          status: 'Stav',
          actions: 'Akce',
          view: 'Zobrazit',
          markDelivered: 'Označit jako doručené',
          
          // Order details modal
          orderDetails: 'Detaily objednávky',
          customerInformation: 'Informace o zákazníkovi',
          name: 'Jméno',
          email: 'E-mail',
          orderInformation: 'Informace o objednávce',
          paid: 'Zaplaceno',
          yes: 'Ano',
          no: 'Ne',
          paidAt: 'Zaplaceno dne',
          deliveredAt: 'Doručeno dne',
          orderItems: 'Položky objednávky',
          product: 'Produkt',
          quantity: 'Množství',
          price: 'Cena',
          allOrders: 'Všechny objednávky',
          noOrdersFound: 'Nebyly nalezeny žádné objednávky',
          
          // Cart
          yourCart: 'Váš košík',
          emptyCart: 'Váš košík je prázdný',
          continueShopping: 'Pokračovat v nákupu',
          remove: 'Odstranit',
          subtotal: 'Mezisoučet',
          totalAmount: 'Celkem',
          proceedToCheckout: 'Pokračovat k pokladně',
          clearCart: 'Vyprázdnit košík',
          pleaseLoginToCheckout: 'Pro dokončení objednávky se prosím přihlaste',
          processingPayment: 'Zpracování...',
          completeDeliveryAddress: 'Prosím, doplňte svou doručovací adresu v Nastavení profilu',
          goToProfileSettings: 'Přejít na nastavení profilu',
          add: 'Přidat',
          
          // Auth
          welcomeToYumrush: 'Vítejte v YUMRUSH',
          Login: 'Přihlášení',
          Register: 'Registrace',
          fullName: 'Celé jméno',
          emailAddress: 'E-mailová adresa',
          password: 'Heslo',
          confirmPassword: 'Potvrdit heslo',
          enterYourName: 'Zadejte své jméno',
          enterYourEmail: 'Zadejte svůj e-mail',
          enterYourPassword: 'Zadejte své heslo',
          confirmYourPassword: 'Potvrďte své heslo',
          pleaseWait: 'Prosím, čekejte...',
          signIn: 'Přihlásit se',
          createAccount: 'Vytvořit účet',
          dontHaveAccount: 'Nemáte účet?',
          registerNow: 'Zaregistrujte se',
          alreadyHaveAccount: 'Již máte účet?',
          signUp: 'Registrovat se',
          
          // Errors
          fillAllFields: 'Prosím vyplňte všechna pole',
          enterName: 'Prosím zadejte své jméno',
          passwordsDontMatch: 'Hesla se neshodují',
          passwordMinLength: 'Heslo musí mít alespoň 6 znaků',
          
          // UI elements
          addToCart: 'Přidat do košíku',
          viewCart: 'Zobrazit košík',
          checkout: 'Zaplatit',
          search: 'Hledat',
          menu: 'Menu',
          profile: 'Profil',
          logout: 'Odhlásit se',
          login: 'Přihlásit se',
          register: 'Registrovat',
          close: 'Zavřít',
          
          // Time and preparation
          preparationTime: 'Doba přípravy',
          minutes: 'minut',
          
          // No results
          noProductsFound: 'Nebyly nalezeny žádné produkty {{category}}',
          loadingMoreProducts: 'Načítání dalších produktů...',
          
          // Success/Errors
          errorProcessingPayment: 'Při zpracování platby došlo k chybě. Zkuste to prosím znovu.',
          
          // Cookie consent
          cookieTitle: 'Používáme cookies',
          cookieText: 'Používáme cookies pro zlepšení vašeho zážitku na našich stránkách. Některé cookies jsou nezbytné pro fungování stránek, zatímco jiné nám pomáhají zlepšit váš zážitek.',
          privacyPolicy: 'Zásady ochrany osobních údajů',
          acceptAll: 'Přijmout vše',
          acceptEssential: 'Pouze nezbytné',
          
          // About page
          aboutYumRush: 'O YumRush',
          ourStory: 'Náš příběh',
          ourStoryText: 'Založeno v roce 2024, YumRush vznikl z jednoduché myšlenky: doručovat výjimečné jídlo bez dlouhého čekání. Věříme, že chutná jídla by měla být dostupná pro každého, kdykoliv dostane hlad.',
          ourMission: 'Naše mise',
          ourMissionText: 'V YumRush je naším posláním spojit hladové zákazníky s jejich oblíbenými místními restauracemi, poskytovat bezproblémové objednávání a bleskově rychlé doručení. Jsme nadšení pro podporu místních podniků a zároveň uspokojování chuťových potřeb.',
          qualityPromise: 'Slib kvality',
          qualityPromiseText: 'Spolupracujeme pouze s restauracemi, které sdílejí náš závazek k kvalitním ingrediencím, výjimečné chuti a zodpovědnému zacházení s potravinami. Když si objednáte přes YumRush, můžete očekávat jen to nejlepší.',
          joinOurTeam: 'Připojte se k našemu týmu',
          joinOurTeamText: 'Vždy hledáme nadšené lidi, kteří se přidají do našeho rostoucího týmu. Ať už jste vývojář, specialista na zákaznický servis nebo řidič doručovatel, rádi se s vámi spojíme. Zkontrolujte naši stránku kariéry pro aktuální příležitosti.',
          
          // Contact page
          contactUs: 'Kontaktujte nás',
          customerService: 'Zákaznický servis',
          customerServiceText: 'Máte dotaz ohledně vaší objednávky?',
          email: 'E-mail',
          phone: 'Telefon',
          hours: 'Hodiny',
          businessInquiries: 'Obchodní dotazy',
          businessInquiriesText: 'Máte zájem o partnerství s YumRush?',
          mainOffice: 'Hlavní kancelář',
          yourName: 'Vaše jméno',
          emailAddress: 'E-mailová adresa',
          subject: 'Předmět',
          selectSubject: 'Vyberte předmět',
          orderIssue: 'Problém s objednávkou',
          accountQuestion: 'Otázka k účtu',
          restaurantPartnership: 'Partnerství restaurace',
          generalFeedback: 'Obecná zpětná vazba',
          other: 'Jiné',
          yourMessage: 'Vaše zpráva',
          sending: 'Odesílání...',
          sendMessage: 'Odeslat zprávu',
          thankYouMessage: 'Děkujeme za vaši zprávu!',
          messageReceivedText: 'Obdrželi jsme váš dotaz a ozveme se vám do 24 hodin.',
          sendAnotherMessage: 'Poslat další zprávu'
        }
      }
    }
  });

export default i18n;
