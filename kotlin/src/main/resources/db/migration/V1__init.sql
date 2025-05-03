CREATE TABLE staff
(
    id        VARCHAR(255) NOT NULL,
    full_name TEXT         NOT NULL,
    phone     TEXT         NOT NULL,
    email     TEXT         NOT NULL,
    prof      TEXT,
    password  TEXT         NOT NULL,
    role      TEXT         NOT NULL,
    CONSTRAINT pk_staff PRIMARY KEY (id)
);

CREATE TABLE tickets
(
    id          VARCHAR(255)                NOT NULL,
    date        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    description TEXT                        NOT NULL,
    results     TEXT,
    doctor      VARCHAR(255)                NOT NULL,
    status      TEXT                        NOT NULL,
    user_id     VARCHAR(255)                NOT NULL,
    CONSTRAINT pk_tickets PRIMARY KEY (id)
);

CREATE TABLE users
(
    id         VARCHAR(255) NOT NULL,
    full_name  TEXT         NOT NULL,
    birthday   TEXT         NOT NULL,
    phone      TEXT         NOT NULL,
    email      TEXT         NOT NULL,
    passport   VARCHAR(10)  NOT NULL,
    snils      VARCHAR(11)  NOT NULL,
    med_policy VARCHAR(16)  NOT NULL,
    password   TEXT         NOT NULL,
    role       TEXT         NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE staff
    ADD CONSTRAINT uc_staff_email UNIQUE (email);

ALTER TABLE staff
    ADD CONSTRAINT uc_staff_phone UNIQUE (phone);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_medpolicy UNIQUE (med_policy);

ALTER TABLE users
    ADD CONSTRAINT uc_users_passport UNIQUE (passport);

ALTER TABLE users
    ADD CONSTRAINT uc_users_phone UNIQUE (phone);

ALTER TABLE users
    ADD CONSTRAINT uc_users_snils UNIQUE (snils);

ALTER TABLE tickets
    ADD CONSTRAINT FK_TICKETS_ON_DOCTOR FOREIGN KEY (doctor) REFERENCES staff (id);

ALTER TABLE tickets
    ADD CONSTRAINT FK_TICKETS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

INSERT INTO public.staff(
    id, email, full_name, password, phone, prof, role)
VALUES ('35b07106-45e5-4892-8fe9-0c8e3adc8310', 'admin@clinic.ru', 'Admin', '$2a$10$.q5s0qRIHK1n0tRuIzxTbuIu5hhgCF.3G0O/toAGwxOJb3GqvbtQS', '1234', null, 'ADMIN');