# Tpeal shop

This project is a point of sale system developed for a retail shop using the Svelte framework. It allows the shop to manage sales transactions, generate sales reports, and process payments with multiple payment channels in Thailand.

This project works with the `tpearl-strapi` project, which provides the backend API for the POS system.

## Installation

To install and run the project, follow these steps:

1. Clone the repository or download the source code.
2. Install Node.js on your system.
3. Install required dependencies using the following command:

```bash
npm install
```

4. Run the application using the following command:

```bash
npm run dev
```

Note that you will also need to install and run the `tpearl-strapi` project in order to use the POS system.

## Features

The POS system offers the following features:

- Process sales transactions by adding products to the cart and processing payment
- Generate sales reports by date, product
- Process payments using cash, PromptPay, Grab, LINEMAN and Robinhood
- Calculate profit after deduct gGross profit (GP) from payment channels 

## Components

The POS system has the following components:

- POS: allows users to process payments. It includes features for managing the shopping cart, and processing payments.
- Manage sales transaction: allows users to view and manage all sales transactions made through the POS system. This includes viewing the details of each transaction, including products purchased, and payment details.
- Sales report: allows users to generate sales reports by date. The reports include detailed information about the sales made through the POS system, such as the number of products sold, the total revenue generated.
- Profit: allows users to track profits by viewing a summary of sales and expenses.

## License
This project is licensed under the MIT License.