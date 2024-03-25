
-- User(user_id,name,email,password)
-- Role(role_id,name,details) 
-- User_Role(user_id,role_id)
-- Permission(permission_id, name, details)
-- Permission_Role(permission_id, role_id)
-- Landfill(landfill_id, manager, name, latitude, longitude)
-- STS(STS_id, manager, Ward_id, capacity, amount, latitude, longitude)
-- Vehicle (vehicle_id, type, capcity)
-- Landfill_entry( landfill_entry_id, landfill_id, vehicle_id, entry_time, departute_time, volume )
-- STS_entry( sts_entry_id, sts_id, vehicle_id, entry_time, departute_time, volume )
-- Bill (bill_id, vehicle_id, timestamp, billed_amount)



CREATE TABLE public."Users"
(
    user_id serial NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(512) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE public."Roles"
(
    role_id serial NOT NULL,
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE public."User_Role"
(
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (role_id)
        REFERENCES public."Roles" (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (user_id)
        REFERENCES public."Users" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Permissions"
(
    permission_id serial NOT NULL,
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (permission_id)
);

CREATE TABLE public."Permission_Role"
(
    permission_id integer NOT NULL,
    role_id integer NOT NULL,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id)
        REFERENCES public."Permissions" (permission_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (role_id)
        REFERENCES public."Roles" (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Landfills"
(
    landfill_id serial NOT NULL,
    manager_id integer NOT NULL,
    name character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id),
    FOREIGN KEY (manager_id)
        REFERENCES public."Users" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."STS"
(
    sts_id serial NOT NULL,
    manager_id integer NOT NULL,
    ward_id integer NOT NULL,
    capacity double precision NOT NULL,
    amount double precision NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (sts_id),
    FOREIGN KEY (manager_id)
        REFERENCES public."Users" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Vehicles"
(
    vehicle_id serial NOT NULL,
    type character varying(256) NOT NULL,
    capacity double precision NOT NULL,
    PRIMARY KEY (vehicle_id)
);

CREATE TABLE public."Landfill_Entries"
(
    landfill_entry_id serial NOT NULL,
    landfill_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time integer NOT NULL,
    departute_time integer NOT NULL,
    volume double precision NOT NULL,
    PRIMARY KEY (landfill_entry_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfills" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicles" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);

CREATE TABLE public."STS_Entries"
(
    sts_entry_id serial NOT NULL,
    sts_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time integer NOT NULL,
    departute_time integer NOT NULL,
    volume double precision NOT NULL,
    PRIMARY KEY (sts_entry_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicles" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);

CREATE TABLE public."Bills"
(
    bill_id serial NOT NULL,
    vehicle_id integer NOT NULL,
    amount double precision NOT NULL,
    timestamp integer NOT NULL,
    PRIMARY KEY (bill_id),
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicles" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);