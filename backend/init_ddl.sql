
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


DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE public."Role"
(
    role_id serial NOT NULL,
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (role_id)
);

INSERT INTO public."Role" (name, details) VALUES ('SYSTEM_ADMIN', 'System Admin role');
INSERT INTO public."Role" (name, details) VALUES ('STS_MANAGER', 'STS Manager role');
INSERT INTO public."Role" (name, details) VALUES ('LANDFILL_MANAGER', 'Landfill Manager role');
INSERT INTO public."Role" (name, details) VALUES ('UNASSIGNED', 'Unassigned role');


CREATE TABLE public."User"
(
    user_id serial NOT NULL,
    name character varying(256) NOT NULL,
    username character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(512) NOT NULL,
    active boolean NOT NULL DEFAULT false,
    banned boolean NOT NULL DEFAULT false,
    role_id integer NOT NULL DEFAULT 4,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id)
        REFERENCES public."Role" (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Insert admin user
INSERT INTO public."User" (name, username, email, password, role_id, active) VALUES ('admin', 'admin', 'admin@admin.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa',1, true);

CREATE TABLE public."Refresh_Token"
(
    user_id integer NOT NULL,
    token character varying(512) NOT NULL,
    PRIMARY KEY (user_id,token),
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


-- CREATE TABLE public."User_Role"
-- (
--     user_id integer NOT NULL,
--     role_id integer NOT NULL,
--     PRIMARY KEY (user_id, role_id),
--     FOREIGN KEY (role_id)
--         REFERENCES public."Role" (role_id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE NO ACTION,
--     FOREIGN KEY (user_id)
--         REFERENCES public."User" (user_id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE NO ACTION
-- );

-- give admin user sysadmin role
-- INSERT INTO public."User_Role" (user_id, role_id) VALUES (1, 1);

CREATE TABLE public."Permission"
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
        REFERENCES public."Permission" (permission_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (role_id)
        REFERENCES public."Role" (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Landfill"
(
    landfill_id serial NOT NULL,
    manager_id integer NOT NULL,
    name character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id),
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
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
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Vehicle"
(
    vehicle_id serial NOT NULL,
    type character varying(256) NOT NULL,
    capacity double precision NOT NULL,
    PRIMARY KEY (vehicle_id)
);

CREATE TABLE public."Landfill_entry"
(
    landfill_entry_id serial NOT NULL,
    landfill_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time integer NOT NULL,
    departute_time integer NOT NULL,
    volume double precision NOT NULL,
    PRIMARY KEY (landfill_entry_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);

CREATE TABLE public."STS_entry"
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
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);

CREATE TABLE public."Bill"
(
    bill_id serial NOT NULL,
    vehicle_id integer NOT NULL,
    amount double precision NOT NULL,
    timestamp integer NOT NULL,
    PRIMARY KEY (bill_id),
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);