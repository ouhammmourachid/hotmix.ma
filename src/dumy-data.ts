import Color from "@/types/color"
import Image from "@/types/image"
import Tag from "@/types/tag"
import Size from "@/types/size"
import Product from "@/types/product"
import Order from "@/types/order"
import User from "@/types/user"
import Item from "@/types/item"
import Review from "@/types/review"

export const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: 'Reviews' }
  ];


  export const colors: Color[] = [
    {
      id: 1,
      name: "red",
      code: "#FF0000",
    },
    {
      id: 2,
      name: "green",
      code: "#69ff73",
    },
    {
      id: 3,
      name: "blue",
      code: "#0000FF",
    },
    {
      id: 4,
      name: "yellow",
      code: "#FFFF00",
    },
    {
      id: 5,
      name: "cyan",
      code: "#00FFFF",
    },
    {
      id: 6,
      name: "magenta",
      code: "#FF00FF",
    },
    {
      id: 7,
      name: "black",
      code: "#000000",
    },
    {
      id: 8,
      name: "white",
      code: "#FFFFFF",
    },
    {
      id: 9,
      name: "gray",
      code: "#808080",
    },
    {
      id: 10,
      name: "maroon",
      code: "#800000",
    },
  ]

  export const images: Image[] = [
      {
        id: 1,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03924.jpg'
      },
      {
        id: 2,
        path:'https://dxlr-eg.com/cdn/shop/files/close.jpg'
      },
      {
        id: 3,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03942.jpg'
      },
      {
        id: 4,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC04327.jpg'
      },
      {
        id: 5,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC04325.jpg'
      },
      {
        id: 6,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03938.jpg'
      },
      {
        id: 7,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03924.jpg'
      },
      {
        id: 8,
        path:'https://dxlr-eg.com/cdn/shop/files/close.jpg'
      },
      {
        id: 9,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03942.jpg'
      },
      {
        id: 10,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC04327.jpg'
      },
      {
        id: 11,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC04325.jpg'
      },
      {
        id: 12,
        path:'https://dxlr-eg.com/cdn/shop/files/DSC03938.jpg'
      },
    ]

  export const tags:Tag[] = [
      {
          id: 1,
          name: 'shirt'
      },
      {
          id: 2,
          name: 'jeans'
      },
      {
          id: 3,
          name: 'shoes'
      },
      {
          id: 4,
          name: 'swimwear'
      },
      {
          id: 5,
          name: 'sweater'
      }
  ]

  export const sizes:Size[] = [
      {
          id: 1,
          name: 'XS'
      },
      {
          id: 2,
          name: 'S'
      },
      {
          id: 3,
          name: 'M'
      },
      {
          id: 4,
          name: 'L'
      },
      {
          id: 5,
          name: 'XL'
      }
  ]

export const categories = [
    {
        id: 1,
        name: 'shirt'
    },
    {
        id: 2,
        name: 'jeans'
    },
    {
        id: 3,
        name: 'shoes'
    },
    {
        id: 4,
        name: 'swimwear'
    },
    {
        id: 5,
        name: 'sweater'
    }
]

  export const products: Product[] = [
      {
        id : 1,
        name: "Esc The Life (Dark Navy)",
        description: `100% cotton
350 GSM
Unisex Hoodie
Regular fit
Machine wash cold / hang to dry (recommended)
Female model is 165cm wearing size L
Male Model is 179cm Wearing Size M`,
        price: 100,
        sale_price: 90,
        status: "published",
        discount: '10',
        created_at: "2024-12-12T17:22:23.203Z",
        updated_at: "2024-12-20T17:22:23.203Z",
        images: images.slice(0,5),
        sizes: sizes.slice(0,3),
        },
        {
        id : 2,
        name: "Gaming Time (Black)",
        description:  `100% cotton
350 GSM
Unisex Hoodie
Regular fit
Machine wash cold / hang to dry (recommended)
Female model is 165cm wearing size L
Male Model is 179cm Wearing Size M`,
        price: 200,
        status: "draft",
        created_at: "2023-02-01T00:00:00Z",
        updated_at: "2023-02-02T00:00:00Z",
        images: images.slice(5,10),
        sizes: sizes.slice(0,5),
        },
        {
        id : 3,
        name: "Lost My Ctrl (Olive)",
        description:  `100% cotton
350 GSM
Unisex Hoodie
Regular fit
Machine wash cold / hang to dry (recommended)
Female model is 165cm wearing size L
Male Model is 179cm Wearing Size M`,
        price: 300,
        sale_price: 250,
        status: "archived",
        discount: '50',
        created_at: "2023-03-01T00:00:00Z",
        updated_at: "2023-03-02T00:00:00Z",
        images: images.slice(0,8),
        sizes: sizes.slice(0,4),
        },
        {
        id : 4,
        name: "Pixel Vision (Dark Navy)",
        description:  `100% cotton
350 GSM
Unisex Hoodie
Regular fit
Machine wash cold / hang to dry (recommended)
Female model is 165cm wearing size L
Male Model is 179cm Wearing Size M`,
        price: 400,
        status: "published",
        created_at: "2023-04-01T00:00:00Z",
        updated_at: "2023-04-02T00:00:00Z",
        images: images.slice(0,6),
        sizes: sizes.slice(0,5),
        },
        {
        id : 5,
        name: "Pixel Vision (Olive)",
        description:  `100% cotton
350 GSM
Unisex Hoodie
Regular fit
Machine wash cold / hang to dry (recommended)
Female model is 165cm wearing size L
Male Model is 179cm Wearing Size M`,
        price: 500,
        sale_price: 450,
        status: "draft",
        discount: '50',
        created_at: "2023-05-01T00:00:00Z",
        updated_at: "2023-05-02T00:00:00Z",
        images: images.slice(0,7),
        sizes: sizes.slice(0,5),
        }
      ]

  export const users: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
      role: "admin",
      created_at: "2024-12-12T17:22:23.203Z",
      is_active: true
      },
      {
      id: 2,
      username: "user",
      email: "user@gmail.com",
      role: "client",
      created_at: "2023-02-01T00:00:00Z",
      is_active: true
      },
      {
      id: 3,
      username: "user2",
      email: "user2@gmail.com",
      role: "client",
      created_at: "2023-03-01T00:00:00Z",
      is_active: false
      },
      {
      id: 4,
      username: "user3",
      email: "user3@gmail.com",
      role: "client",
      created_at: "2023-04-01T00:00:00Z",
      is_active: true
      }
  ]

  export const items: Item[] = [
    {
      id: 1,
      product: products[1],
      quantity: 2,
      price: 200,
      color: colors[1],
      size: sizes[1],
    },
    {
      id: 2,
      product: products[2],
      quantity: 3,
      price: 300,
      color: colors[2],
      size: sizes[2],
    },
    {
      id: 3,
      product: products[3],
      quantity: 4,
      price: 400,
      color: colors[3],
      size: sizes[3],
    },
    {
      id: 4,
      product: products[4],
      quantity: 5,
      price: 500,
      color: colors[4],
      size: sizes[4],
    }
  ]

  export const orders: Order[] = [
    {
      id: 1,
      customer: users[1],
      items: items.slice(0,2),
      total_price: 300,
      status: "delivered",
      created_at: "2024-12-12T17:22:23.203Z",
      updated_at: "2024-12-20T17:22:23.203Z",
      shipping_address :"1234 Main St, New York, NY 10030",
      shipping_date: "2024-12-12T17:22:23.203Z",
      return_date: "2024-12-20T17:22:23.203Z",
      gift: false,
      gift_message: "",
      phone_number: "1234567890",
      delevery_date: "2024-12-20T17:22:23.203Z"
    },
    {
      id: 2,
      customer: users[2],
      items: items.slice(2,4),
      total_price: 700,
      status: "shipped",
      created_at: "2023-02-01T00:00:00Z",
      updated_at: "2023-02-02T00:00:00Z",
      phone_number: "1234567890",
      shipping_address :"1234 Main St, New York, NY 10030",
      gift: true,
      gift_message: "Happy Birthday"
    }
  ]


  export const reviews:Review[]= [
    {
      id: 1,
      customer: users[1],
      rating: 5,
      created_at: "2024-12-12T17:22:23.203Z",
      updated_at: "2024-12-20T17:22:23.203Z",
      comment: 'El matrial mshoftsh zyha 3nd 7ad bgd to7fa t2ela gdn masha\'allah ❤️❤️❤️',
      display: true,
      product: products[1]

    },
    {
      id: 2,
      customer: users[2],
      rating: 4,
      created_at: "2023-02-01T00:00:00Z",
      updated_at: "2023-02-02T00:00:00Z",
      comment: 'الخامة حلوة والتعامل حلو',
      display: true,
      product: products[2]
    }
  ];

