
-- User(user_id,name,email,password)
-- Role(role_id,name,details) 
-- User_Role(user_id,role_id)
-- Permission(permission_id, name, details)
-- Permission_Role(permission_id, role_id)
-- Landfill(landfill_id, manager, name, latitude, longitude)
-- STS(STS_id, Ward_id, capacity, amount, latitude, longitude)
-- Vehicle (vehicle_id, type, capcity)
-- Landfill_entry( landfill_entry_id, landfill_id, vehicle_id, entry_time, departute_time, volume )
-- STS_entry( sts_entry_id, sts_id, vehicle_id, entry_time, departute_time, volume )
-- Bill (bill_id, vehicle_id, timestamp, billed_amount)


DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE public."Role"
(
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (name)
);

INSERT INTO public."Role" (name, details) VALUES ('SYSTEM_ADMIN', 'System Admin role');
INSERT INTO public."Role" (name, details) VALUES ('STS_MANAGER', 'STS Manager role');
INSERT INTO public."Role" (name, details) VALUES ('LANDFILL_MANAGER', 'Landfill Manager role');
INSERT INTO public."Role" (name, details) VALUES ('UNASSIGNED', 'Unassigned role');


CREATE TABLE public."User"
(
    user_id serial NOT NULL,
    name character varying(256) NOT NULL,
    username character varying(256) UNIQUE NOT NULL,
    email character varying(256) UNIQUE NOT NULL,
    password character varying(512) NOT NULL,
    active boolean NOT NULL DEFAULT false,
    banned boolean NOT NULL DEFAULT false,
    role_name character varying(256) DEFAULT 'UNASSIGNED' NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_name)
        REFERENCES public."Role" (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Insert admin user
INSERT INTO public."User" (name, username, email, password, role_name, active) VALUES ('admin', 'admin', 'admin@admin.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','SYSTEM_ADMIN', true);
-- insert sts manager user
INSERT INTO public."User" (name, username, email, password, role_name, active) VALUES ('sts_manager', 'sts_manager', 'sts@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','STS_MANAGER', true);
-- insert landfill manager user
INSERT INTO public."User" (name, username, email, password, role_name, active) VALUES ('landfill_manager', 'landfill_manager', 'landfill@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','LANDFILL_MANAGER', true);
-- insert an unassigned user
INSERT INTO public."User" (name, username, email, password, role_name, active) VALUES ('unassigned', 'unassigned', 'unassigned@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','UNASSIGNED', true);

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


CREATE TABLE public."Permission"
(
    name character varying(256) NOT NULL,
    details character varying(256) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE public."Permission_Role"
(
    role_name character varying(256) NOT NULL,
    permission_name character varying(256) NOT NULL,
    PRIMARY KEY (role_name, permission_name),
    FOREIGN KEY (role_name)
        REFERENCES public."Role" (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (permission_name)
        REFERENCES public."Permission" (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

/***

STS
    - Ward_id [int]
    - Name [string]
    - Capacity [double]
    - Latitude [double]
    - Longitude [double]

STS_Manager
    - sts_id [int]
    - user_id [int]

STS_entry
    - sts_id [int]
    - manager_id [int]
    - entry_time [timestamp]
    - departure_time [timestamp] [nullable]
    - vehicle_id [int] [nullable]
    - volume [double] [ + or - ] [ + for entry, - for exit]

Landfill
    - Name [string]
    - Start_time [timestamp]
    - End_time [timestamp]
    - Latitude [double]
    - Longitude [double]

Landfill_Manager
    - landfill_id [int]
    - user_id [int]

Landfill_entry
    - landfill_id [int]
    - manager_id [int]
    - vehicle_id [int]
    - entry_time [timestamp]
    - departure_time [timestamp]
    - volume [double]

***/

CREATE TABLE public."STS"
(
    sts_id serial NOT NULL,
    ward_id integer NOT NULL,
    capacity double precision NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (sts_id)
);


CREATE TABLE public."STS_Manager"
(
    sts_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (sts_id, user_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Landfill"
(
    landfill_id serial NOT NULL,
    name character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id)
);

CREATE TABLE public."Landfill_Manager"
(
    landfill_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (landfill_id, user_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE public."Vehicle"
(
    vehicle_id serial NOT NULL,
    registration character varying(256) UNIQUE NOT NULL,
    type character varying(256) NOT NULL,
    capacity double precision NOT NULL,
    disabled boolean DEFAULT false,
    fuel_cost_per_km_loaded double precision NOT NULL,
    fuel_cost_per_km_unloaded double precision NOT NULL,
    landfill_id integer,
    PRIMARY KEY (vehicle_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Landfill_Entry"
(
    landfill_entry_id serial NOT NULL,
    landfill_id integer NOT NULL,
    manager_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time integer NOT NULL,
    departure_time integer NOT NULL,
    volume double precision NOT NULL,
    PRIMARY KEY (landfill_entry_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."STS_Entry"
(
    sts_entry_id serial NOT NULL,
    sts_id integer NOT NULL,
    manager_id integer NOT NULL,
    entry_time integer NOT NULL,
    departure_time integer,
    vehicle_id integer,
    volume double precision NOT NULL,
    PRIMARY KEY (sts_entry_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
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

INSERT INTO public."Permission" (name, details) VALUES ('LOGIN', 'Login permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_USER', 'Create User permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_USER', 'Update User permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_USER', 'Delete User permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_USER', 'View User permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_ROLE', 'Create Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_ROLE', 'Update Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_ROLE', 'Delete Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_ROLE', 'View Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_PERMISSION', 'Create Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_PERMISSION', 'Update Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_PERMISSION', 'Delete Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_PERMISSION', 'View Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('ASSIGN_ROLE', 'Assign Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('UNASSIGN_ROLE', 'Unassign Role permission');
INSERT INTO public."Permission" (name, details) VALUES ('ASSIGN_PERMISSION', 'Assign Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('UNASSIGN_PERMISSION', 'Unassign Permission permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_LANDFILL', 'Create Landfill permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_LANDFILL', 'Update Landfill permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_LANDFILL', 'Delete Landfill permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_LANDFILL', 'View Landfill permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_STS', 'Create STS permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_STS', 'Update STS permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_STS', 'Delete STS permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_STS', 'View STS permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_VEHICLE', 'Create Vehicle permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_VEHICLE', 'Update Vehicle permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_VEHICLE', 'Delete Vehicle permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_VEHICLE', 'View Vehicle permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_LANDFILL_ENTRY', 'Create Landfill Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_LANDFILL_ENTRY', 'Update Landfill Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_LANDFILL_ENTRY', 'Delete Landfill Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_LANDFILL_ENTRY', 'View Landfill Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_STS_ENTRY', 'Create STS Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_STS_ENTRY', 'Update STS Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_STS_ENTRY', 'Delete STS Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_STS_ENTRY', 'View STS Entry permission');
INSERT INTO public."Permission" (name, details) VALUES ('CREATE_BILL', 'Create Bill permission');
INSERT INTO public."Permission" (name, details) VALUES ('UPDATE_BILL', 'Update Bill permission');
INSERT INTO public."Permission" (name, details) VALUES ('DELETE_BILL', 'Delete Bill permission');
INSERT INTO public."Permission" (name, details) VALUES ('VIEW_BILL', 'View Bill permission');

-- login permission to all user except unassigned
INSERT INTO public."Permission_Role" (role_name, permission_name)
    VALUES ('STS_MANAGER', 'LOGIN');
INSERT INTO public."Permission_Role" (role_name, permission_name)
    VALUES ('LANDFILL_MANAGER', 'LOGIN');


-- nested query to get all permissions and give them to system admin
INSERT INTO public."Permission_Role" (role_name, permission_name)
    SELECT 'SYSTEM_ADMIN', name FROM public."Permission";



