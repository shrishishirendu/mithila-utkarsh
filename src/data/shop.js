// Curated shop products shown on /shop.
//
// This is the no-API fallback: when the Etsy API isn't connected (app pending /
// banned), /shop renders these. The moment the Etsy API works, its LIVE listings
// automatically take precedence over this list — so it's safe to keep either way.
//
// HOW TO ADD A PRODUCT — one object per item:
//   id       any unique string (a slug)
//   title    product name as shown
//   price    shown as-is, e.g. "45.00"
//   currency e.g. "AUD" (optional)
//   image    product photo. Easiest: open the Etsy listing → right-click the main
//            photo → "Copy image address" (an i.etsystatic.com URL). OR drop a
//            file in /public and use "/myphoto.jpg".
//   url      the Etsy listing URL (where checkout happens).
export const FEATURED_PRODUCTS = [
  // {
  //   id: "madhubani-fish-lotus",
  //   title: "Madhubani Painting — Fish & Lotus",
  //   price: "45.00",
  //   currency: "AUD",
  //   image: "https://i.etsystatic.com/…/il_570xN.jpg",
  //   url: "https://www.etsy.com/listing/000000000/…",
  // },
];

// "Visit our Etsy shop" link fallback (used when the API isn't returning it).
export const ETSY_SHOP_URL = "https://www.etsy.com/shop/MithilaUtkarsh";
