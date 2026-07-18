export interface Firmware {
  id: number;
  model: string;
  brand: string;
  version: string;
  size: string;
  date: string;
  downloads: number;
  type: string;
}

export interface Schematic {
  id: number;
  title: string;
  brand: string;
  category: 'power-supply' | 'main-board' | 't-con';
  model: string;
  size: string;
  date: string;
  downloads: number;
}

export interface DownloadRecord {
  id: number;
  title: string;
  type: string;
  date: string;
  size: string;
}

export interface StoreOrder {
  id: number;
  orderNumber: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export const brands = [
  'Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Toshiba', 'Sharp',
  'Philips', 'Panasonic', 'Haier', 'Skyworth', 'Changhong'
];

export const firmwareData: Firmware[] = [
  { id: 1, model: 'UA32T5300', brand: 'Samsung', version: 'T-MST14CDAU3.0', size: '1.2 GB', date: '2024-03-15', downloads: 342, type: 'Full Dump' },
  { id: 2, model: 'UA43AU7000', brand: 'Samsung', version: 'T-KTSUSC.7105', size: '890 MB', date: '2024-03-10', downloads: 256, type: 'OTA Update' },
  { id: 3, model: '43LM6370', brand: 'LG', version: 'webOS 6.0', size: '1.5 GB', date: '2024-03-08', downloads: 189, type: 'Full Dump' },
  { id: 4, model: '55UN7340', brand: 'LG', version: 'webOS 5.0', size: '1.1 GB', date: '2024-03-05', downloads: 421, type: 'Full Dump' },
  { id: 5, model: 'KD-43X75K', brand: 'Sony', version: 'Android TV 12', size: '2.1 GB', date: '2024-02-28', downloads: 167, type: 'OTA Update' },
  { id: 6, model: '43P635', brand: 'TCL', version: 'Google TV', size: '1.8 GB', date: '2024-02-25', downloads: 298, type: 'Full Dump' },
  { id: 7, model: '50A6H', brand: 'Hisense', version: 'VIDAA U6', size: '950 MB', date: '2024-02-20', downloads: 134, type: 'Full Dump' },
  { id: 8, model: '32V35KV', brand: 'Toshiba', version: 'VIDAA 5.0', size: '780 MB', date: '2024-02-18', downloads: 203, type: 'OTA Update' },
  { id: 9, model: '2T-C42EG1X', brand: 'Sharp', version: 'Android TV 11', size: '1.6 GB', date: '2024-02-15', downloads: 156, type: 'Full Dump' },
  { id: 10, model: '43PFT6917', brand: 'Philips', version: 'Android TV 11', size: '1.4 GB', date: '2024-02-12', downloads: 187, type: 'Full Dump' },
  { id: 11, model: 'TH-43MX650', brand: 'Panasonic', version: 'Google TV', size: '2.0 GB', date: '2024-02-10', downloads: 112, type: 'OTA Update' },
  { id: 12, model: 'LE43K6600UG', brand: 'Haier', version: 'Android 11', size: '1.3 GB', date: '2024-02-08', downloads: 98, type: 'Full Dump' },
];

export const schematicsData: Schematic[] = [
  { id: 1, title: 'Samsung BN44-00852A Power Supply', brand: 'Samsung', category: 'power-supply', model: 'UA32J4003', size: '4.5 MB', date: '2024-03-12', downloads: 567 },
  { id: 2, title: 'Samsung BN94-12871A Main Board', brand: 'Samsung', category: 'main-board', model: 'UA55NU7100', size: '8.2 MB', date: '2024-03-10', downloads: 432 },
  { id: 3, title: 'LG EAY64928801 Power Supply', brand: 'LG', category: 'power-supply', model: '49UK6300', size: '5.1 MB', date: '2024-03-08', downloads: 345 },
  { id: 4, title: 'LG EBT65295703 Main Board', brand: 'LG', category: 'main-board', model: '55UK6540', size: '7.8 MB', date: '2024-03-05', downloads: 278 },
  { id: 5, title: 'Samsung BN96-39595A T-Con Board', brand: 'Samsung', category: 't-con', model: 'UA49KU7500', size: '3.2 MB', date: '2024-02-28', downloads: 198 },
  { id: 6, title: 'Sony APS-395 Power Supply', brand: 'Sony', category: 'power-supply', model: 'KDL-43W800C', size: '6.3 MB', date: '2024-02-25', downloads: 234 },
  { id: 7, title: 'TCL 40-L141H4-PWB1CG Power Supply', brand: 'TCL', category: 'power-supply', model: '55P615', size: '4.8 MB', date: '2024-02-20', downloads: 167 },
  { id: 8, title: 'LG 6871L-5765A T-Con Board', brand: 'LG', category: 't-con', model: '55UJ630V', size: '2.9 MB', date: '2024-02-18', downloads: 145 },
  { id: 9, title: 'Sharp DUNTKE558FM01 Main Board', brand: 'Sharp', category: 'main-board', model: 'LC-40LE265M', size: '9.1 MB', date: '2024-02-15', downloads: 123 },
  { id: 10, title: 'Panasonic TNP4G548 Main Board', brand: 'Panasonic', category: 'main-board', model: 'TH-43GX600', size: '7.4 MB', date: '2024-02-12', downloads: 112 },
];

export const recentDownloads: DownloadRecord[] = [
  { id: 1, title: 'Samsung UA32T5300 - Full Dump', type: 'سوفتوير', date: '2024-03-15 14:30', size: '1.2 GB' },
  { id: 2, title: 'LG EAY64928801 Power Supply', type: 'مخطط', date: '2024-03-14 09:15', size: '5.1 MB' },
  { id: 3, title: 'TCL 43P635 - Google TV', type: 'سوفتوير', date: '2024-03-13 16:45', size: '1.8 GB' },
  { id: 4, title: 'Samsung BN94-12871A Main Board', type: 'مخطط', date: '2024-03-12 11:20', size: '8.2 MB' },
  { id: 5, title: 'Sony KD-43X75K - Android TV 12', type: 'سوفتوير', date: '2024-03-11 08:50', size: '2.1 GB' },
];

export const downloadHistory: DownloadRecord[] = [
  ...recentDownloads,
  { id: 6, title: 'Hisense 50A6H - VIDAA U6', type: 'سوفتوير', date: '2024-03-10 13:40', size: '950 MB' },
  { id: 7, title: 'LG EBT65295703 Main Board', type: 'مخطط', date: '2024-03-09 10:25', size: '7.8 MB' },
  { id: 8, title: 'Sharp 2T-C42EG1X - Android TV', type: 'سوفتوير', date: '2024-03-08 15:10', size: '1.6 GB' },
  { id: 9, title: 'Samsung BN96-39595A T-Con', type: 'مخطط', date: '2024-03-07 09:55', size: '3.2 MB' },
  { id: 10, title: 'Philips 43PFT6917 - Android TV', type: 'سوفتوير', date: '2024-03-06 12:30', size: '1.4 GB' },
];

export const storeOrders: StoreOrder[] = [
  { id: 1, orderNumber: 'ORD-2024-001', product: 'باقة سيريال 100 تحميل', quantity: 1, price: 150, status: 'delivered', date: '2024-03-01' },
  { id: 2, orderNumber: 'ORD-2024-002', product: 'باقة سيريال 50 تحميل', quantity: 2, price: 160, status: 'processing', date: '2024-03-10' },
  { id: 3, orderNumber: 'ORD-2024-003', product: 'أداة قراءة EEPROM', quantity: 1, price: 250, status: 'shipped', date: '2024-03-12' },
  { id: 4, orderNumber: 'ORD-2024-004', product: 'باقة سيريال 200 تحميل', quantity: 1, price: 280, status: 'pending', date: '2024-03-15' },
];

export const smdResistorCodes: Record<string, string> = {
  '100': '10 Ω',
  '101': '100 Ω',
  '102': '1 kΩ',
  '103': '10 kΩ',
  '104': '100 kΩ',
  '105': '1 MΩ',
  '110': '11 Ω',
  '111': '110 Ω',
  '112': '1.1 kΩ',
  '120': '12 Ω',
  '121': '120 Ω',
  '122': '1.2 kΩ',
  '150': '15 Ω',
  '151': '150 Ω',
  '152': '1.5 kΩ',
  '200': '20 Ω',
  '201': '200 Ω',
  '202': '2 kΩ',
  '220': '22 Ω',
  '221': '220 Ω',
  '222': '2.2 kΩ',
  '223': '22 kΩ',
  '224': '220 kΩ',
  '270': '27 Ω',
  '271': '270 Ω',
  '272': '2.7 kΩ',
  '330': '33 Ω',
  '331': '330 Ω',
  '332': '3.3 kΩ',
  '333': '33 kΩ',
  '390': '39 Ω',
  '391': '390 Ω',
  '392': '3.9 kΩ',
  '470': '47 Ω',
  '471': '470 Ω',
  '472': '4.7 kΩ',
  '473': '47 kΩ',
  '474': '470 kΩ',
  '510': '51 Ω',
  '511': '510 Ω',
  '512': '5.1 kΩ',
  '560': '56 Ω',
  '561': '560 Ω',
  '562': '5.6 kΩ',
  '680': '68 Ω',
  '681': '680 Ω',
  '682': '6.8 kΩ',
  '683': '68 kΩ',
  '750': '75 Ω',
  '751': '750 Ω',
  '752': '7.5 kΩ',
  '820': '82 Ω',
  '821': '820 Ω',
  '822': '8.2 kΩ',
};

export const serviceCodes = [
  { brand: 'Samsung', codes: [
    { code: '0000', description: 'الكود الافتراضي للقائمة السرية' },
    { code: '1234', description: 'كود بديل للقائمة السرية' },
    { code: 'Mute → 1-8-2 → Power', description: 'الدخول لقائمة الخدمة (Service Menu)' },
    { code: 'Info → Menu → Mute → Power', description: 'إعادة ضبط المصنع' },
    { code: 'Display → P.STD → Mute → Power', description: 'وضع الفندق (Hotel Mode)' },
  ]},
  { brand: 'LG', codes: [
    { code: 'Menu → 0-0-0-0', description: 'الدخول لقائمة الخدمة' },
    { code: 'OK → 0-0-0-0', description: 'قائمة الخدمة البديلة' },
    { code: 'In-Start', description: 'وضع المصنع (بعد تثبيت تطبيق In-Start)' },
    { code: '1105', description: 'إعادة ضبط كلمة السر' },
  ]},
  { brand: 'Sony', codes: [
    { code: 'Display → 5 → Vol+ → Power', description: 'الدخول لقائمة الخدمة' },
    { code: 'i+ → 5 → Vol+ → Power', description: 'قائمة الخدمة (موديلات حديثة)' },
    { code: '0000', description: 'الكود الافتراضي' },
    { code: '9999', description: 'كود الحماية الأبوية' },
  ]},
  { brand: 'TCL', codes: [
    { code: '1950', description: 'الدخول لقائمة الخدمة' },
    { code: 'Menu → 1-1-4-7', description: 'قائمة Factory Mode' },
    { code: '0000', description: 'الكود الافتراضي' },
  ]},
  { brand: 'Hisense', codes: [
    { code: 'Menu → 1-9-6-9', description: 'الدخول لقائمة الخدمة' },
    { code: '0000', description: 'الكود الافتراضي' },
    { code: 'Display → 2-5-8-0', description: 'قائمة Factory Reset' },
  ]},
  { brand: 'Toshiba', codes: [
    { code: 'Menu → 1-2-3-4', description: 'الدخول لقائمة الخدمة' },
    { code: '0000', description: 'الكود الافتراضي' },
    { code: '9-8-7-6', description: 'كود إعادة الضبط' },
  ]},
];
