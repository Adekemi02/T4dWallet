 [v1.0.0] - 2024-09-28: Added [ Kachie Osuji ]
    - New Feature: Set up project folder architecture. [See docs/configuration.md](./docs/configuration.md) [ Kachie Osuji ]
    - New Feature: Set up the following models using mongoose - User, Wallet, OTP, and transactiom. [See docs/configuration.md](./docs/configuration.md) [ Kachie Osuji ]
    - New Feature: Set up mongoDB connection. [See docs/configuration.md](./docs/configuration.md) [ Kachie Osuji ]


[v1.0.0] - 2024-10-05: Added [ Kachie Osuji ]
    - New Feature: Implemented signup endpoint. [See docs/api.md]
    - New Feature: Added validation for user input on signup. [See docs/configuration.md]
    - New Feature: Configured email verification via OTP after signup using Nodemailer. [See docs/configuration.md]
    - New Feature: Integrated bcrypt for password hashing during user registration.[ See docs/configuration.md]

[v1.0.0] - 2024-10-26: Added [ Kachie Osuji ]

- New Feature: Implemented login endpoint. [See docs/api.md]
- New Feature: Added JWT token generation for user authentication. [See docs/configuration.md]
- New Feature: Validated login credentials with bcrypt and issued authentication token. [See docs/api.md]

[v1.0.0] - 2024-10-28: Added [ Kachie Osuji ]

- New Feature: Implemented OTP verification endpoint. [See docs/api.md]
- New Feature: Integrated OTP verification logic with user confirmation. [See docs/configuration.md]
- New Feature: Emit events upon successful OTP verification. [See docs/api.md]

[v1.0.0] - 2024-11-02: Added [ Kachie Osuji ]

- New Feature: Implemented fund wallet endpoint. [See docs/api.md]
- New Feature: Added validation for wallet funding requests. [See docs/configuration.md]
- New Feature: Integrated transaction logging for funding. [See docs/api.md]
- New Feature: Set up Emit events for operations using Nodejs event emitter success. [See docs/configuration.md]

[v1.0.0] - 2024-11-02: Added [ Kachie Osuji ]

- New Feature: Implemented withdraw fund endpoint. [See docs/api.md]
- New Feature: Added validation for withdrawal requests. [See docs/configuration.md]
- New Feature: Updated wallet balance after successful withdrawal. [See docs/api.md]
- New Feature: Integrated transaction logging for withdrawal. [See docs/api.md]
- New Feature: Emit events for wallet withdrawal success. [See docs/api.md]

[v1.0.0] - 2024-11-05: Added [ Kachie Osuji ]

- New Feature: Implemented get user wallet endpoint. [See docs/api.md]
- New Feature: Retrieved wallet details including wallet ID and balance. [See docs/api.md]
- New Feature: Provided detailed error handling for wallet retrieval. [See docs/api.md]

[v1.0.0] - 2024-11-10: Added [ Kachie Osuji ]

- New Feature: Implemented resolve wallet by ID endpoint. [See docs/api.md]
- New Feature: Provided wallet details such as wallet name and status upon successful resolution. [See docs/api.md]
- New Feature: Added error handling for failed wallet resolution. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented set wallet pin endpoint. [See docs/api.md]
- New Feature: Added validation for wallet pin input. [See docs/configuration.md]
- New Feature: Updated wallet record to store the newly set pin. [See docs/api.md]
- New Feature: Provided error handling for invalid wallet pin set attempts. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented change wallet pin endpoint. [See docs/api.md]
- New Feature: Added validation for the old and new pin inputs. [See docs/configuration.md]
- New Feature: Updated wallet pin and set next change date. [See docs/api.md]
- New Feature: Added OTP expiration check before allowing pin change. [See docs/api.md]
- New Feature: Provided error handling for invalid pin change attempts. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented save new beneficiary endpoint. [See docs/api.md]
- New Feature: Added validation for beneficiary input. [See docs/configuration.md]
- New Feature: Saved new beneficiary data to the user's account. [See docs/api.md]
- New Feature: Provided error handling for saving new beneficiaries. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented delete beneficiary endpoint. [See docs/api.md]
- New Feature: Added validation for beneficiary ID input. [See docs/configuration.md]
- New Feature: Deleted beneficiary record from the database. [See docs/api.md]
- New Feature: Provided error handling for deleting beneficiaries. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented get beneficiaries endpoint. [See docs/api.md]
- New Feature: Retrieved all beneficiaries associated with the user. [See docs/api.md]
- New Feature: Added pagination for fetching beneficiaries. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented get one beneficiary endpoint. [See docs/api.md]
- New Feature: Retrieved detailed information of a single beneficiary by ID. [See docs/api.md]
- New Feature: Added error handling for non-existent beneficiary. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented search beneficiaries endpoint. [See docs/api.md]
- New Feature: Enabled searching beneficiaries by query parameter. [See docs/api.md]
- New Feature: Added error handling for failed search queries. [See docs/api.md]

[v1.0.0] - 2024-11-15: Added [ Kachie Osuji ]

- New Feature: Implemented transfer funds endpoint. [See docs/api.md]
- New Feature: Added validation for transfer request input. [See docs/configuration.md]
- New Feature: Updated wallet balance after successful transfer. [See docs/api.md]
- New Feature: Integrated transaction logging for transfer. [See docs/api.md]
- New Feature: Emit events for transfer success. [See docs/api.md]
