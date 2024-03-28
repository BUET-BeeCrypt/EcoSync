
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
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Insert admin user
INSERT INTO public."User" (name, username, email, password, role_name, active) VALUES 
    ('admin', 'admin', 'admin@admin.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','SYSTEM_ADMIN', true),
-- insert sts manager user
    ('sts_manager', 'sts_manager', 'sts@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','STS_MANAGER', true),
    ('sts_manager1', 'sts_manager1', 'sts1@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','STS_MANAGER', true),
-- insert landfill manager user
    ('landfill_manager', 'landfill_manager', 'landfill@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','LANDFILL_MANAGER', true),
    ('landfill_manager1', 'landfill_manager1', 'landfill1@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','LANDFILL_MANAGER', true),
-- insert an unassigned user
    ('unassigned', 'unassigned', 'unassigned@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','UNASSIGNED', true),
    ('unassigned1', 'unassigned1', 'unassigned1@email.com', '$2a$04$RyESvcxCSv2pb0tYggsEfeMQL5PbGChly7SwlAHGOCqjvK57iikOa','UNASSIGNED', true);

CREATE TABLE public."Refresh_Token"
(
    user_id integer NOT NULL,
    token character varying(512) NOT NULL,
    PRIMARY KEY (user_id,token),
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
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
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (permission_name)
        REFERENCES public."Permission" (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
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
    zone_no INTEGER NOT NULL,
    ward_no integer NOT NULL,
    name character varying(256) NOT NULL UNIQUE,
    location character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    capacity double precision NOT NULL, -- Total Volume Of Garbage Day
    dump_area double precision NOT NULL, -- Total Area Of Dumping Area
    coverage_area double precision NOT NULL, -- Total Area Of Coverage Area
    PRIMARY KEY (sts_id)
);


INSERT INTO public."STS" (zone_no,ward_no,"name","location",latitude,longitude,capacity,dump_area,coverage_area) VALUES
        (1,1,'Ranavola Section-10 STS','Ranavola, Section-10, Uttara',23.8841,90.3908,80,130,3300),
        (1,1,'BDR Bazar STS','BDR bazar, Uttara',23.8706,90.4007,58,130,7350),
        (1,17,'Nikunja-2 STS','West side of Road No-18, Nikonja',23.8346,90.4144,12,130,2700),
        (1,17,'Kuril Bishawroad STS','Kuril Bishawroad, Vatara',23.8211,90.4194,14,130,1650),
        (2,2,'Mirpur Ceramic Road STS','Mirpur Ceramic Road',23.8291,90.3656,30,130,10000),
        (2,15,'Manikdi Graveyard STS','Manikdi Graveyard, Mirpur',23.8244,90.394,25,130,5000),
        (2,5,'Kalshi Road STS','East side of Kalshi Road, Mirpur',23.8215,90.3776,20,130,3000),
        (2,6,'Arambagh Culvert STS','Arambagh Culvert, Mirpur',23.8169,90.3572,35,130,3000),
        (2,3,'Mirpur DSCC Market STS','Mirpur DSCC Market , Mirpur',23.8136,90.3701,20,130,1800),
        (2,3,'Jalladkhana STS','Jalladkhana, Mirpur',23.8109,90.3759,20,130,5000),
        (2,15,'Vasantek Market STS','Vasantech Bazar, Mirpur',23.8108,90.3922,30,130,8000),
        (2,8,'Rainkhola STS','Rainkhola. Mirpur',23.8064,90.3514,30,130,10000),
        (2,7,'Shyalbari Mor STS','Shyalbari Morh, Mirpur',23.8084,90.3581,20,130,10000),
        (2,7,'Proshika Office STS','Near to Proshika Office, Mirpur 2',23.8091,90.3599,15,130,1500),
        (2,4,'Baishteki Culvert STS','Baishteki Culvert, Mirpur 13',23.8086,90.3845,30,130,2400),
        (3,35,'Eskaton Road STS','Eskaton Road, Mogbazar',23.748,90.4017,38,130,13800),
        (3,35,'Mogbazar BTCL STS','Adjacent To Mogbazar BTCL Office, Maghbazar',23.752,90.4094,40,130,17500),
        (3,35,'Nayatola Park STS','Nayatola, Maghbazar',23.7541,90.4081,12,130,5000),
        (3,23,'Khilgaon Graveyard STS','Khilgaon Graveyard',23.7528,90.4255,44,130,7000),
        (3,22,'Bansree STS','Bansree, Rampura',23.7678,90.4234,37,130,31500),
        (3,21,'Gudara Ghat Badda STS','Gudara Ghat, Badda',23.7963,90.4282,300,130,14700),
        (3,19,'Gulshan Shooting Club STS','Opposite Police Plasa, Gulsha',23.7729,90.4151,50,130,5500),
        (3,24,'Orion Morh STS','Tejgaon Orion Morh, Tejgaon',23.767,90.4051,112,130,11000),
        (3,18,'Natun Bazar STS','Natun Bazar, Baridhara',23.7993,90.423,200,150,60000),
        (3,19,'Banani BTCL Office STS','BTCL Office, Banani',23.7868,90.4083,10,130,2000),
        (3,20,'Karail T&T Playground STS','Karail T&T Playground',23.7846,90.4044,60,130,7500),
        (4,10,'Mazar Road STS','Mazar Road, Diabari, Mirpur',23.7983,90.3449,30,130,12800),
        (4,9,'Mirpur 10 No. Community Center STS','Budhijibi Shahid Minar rd, Mirpur',23.7923,90.3463,23,100,2000),
        (4,12,'Tolarbag STS','Tolarbag, Mirpur',23.789,90.3536,40,130,24000),
        (4,16,'Kachukhet, WASA Pump STS','WASA Pump, Kochukhet, Cantonment',23.7888,90.3881,80,130,72000),
        (4,14,'Agargaon Taltola STS','Agargaon Taltola Bus stand, Mirpur',23.7836,90.3788,40,130,15000),
        (4,10,'Mohona Pamp STS','Mohona Pamp, Technical, Mirpur',23.782,90.3496,40,0,2100),
        (5,33,'Basila Bridge STS','Near Basila Bridge, Mohammadpur',23.7456,90.3484,25,0,2500),
        (5,34,'Rayerbazar Beribund STS','Rayerbazar, Mohammadpur',23.7444,90.3598,27,130,15360),
        (5,26,'Kawran Bazar STS','Kawran Bazar',23.7518,90.3948,15,130,10000),
        (5,26,'Tejkunipara Playground STS','Tejkunipara Playground',23.7622,90.3935,10,130,6000),
        (5,27,'Khejur Bagan STS','Khejur Bagan, Shere Bangla Nagar',23.7581,90.3836,33,130,13320),
        (5,31,'Town Hall STS','Town Hall, Mohammadpur',23.7733,90.3856,27,130,13300),
        (5,31,'Mohammadpur Fertility STS','Mohammadpur Fertility',23.7627,90.3659,18,130,3375),
        (5,33,'Jaker Dairy Farm STS','Jaker Dairy Farm, Beribund, Mohammadpur',23.7602,90.3515,43,130,22500),
        (5,30,'Dhaka Uddan STS','Dhaka Uddan, Mohammadpur',23.764,90.3479,18,130,5460),
        (5,30,'Kallyanpur Bus Stand STS','Kallyanpur Bus Stand',23.7774,90.3618,20,130,9460),
        (5,27,'Pongu Hospital STS','Pongu Haspatal, Agargaon',23.7744,90.371,36,130,10500),
        (5,29,'Badsha Faysal School STS','Badshah Faisal School, Ring Road, Adabor',23.7719,90.3604,20,130,5040),
        (5,27,'PGR Ganabhaban STS','PGR Ganabhaban, Sher E Bangla Nagar',23.767,90.3732,5,100,400),
        (6,51,'Uttara Section-12 Graveyard STS','Section-12 Graveyard, Uttara',23.8707,90.3784,10,130,2500);

CREATE TABLE public."STS_Manager"
(
    sts_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (sts_id, user_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public."Landfill"
(
    landfill_id serial NOT NULL,
    name character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id)
);

INSERT INTO public."Landfill" (name, latitude, longitude) VALUES ('Amin Bazar Landfill site', 23.797947, 90.300300);

CREATE TABLE public."Landfill_Manager"
(
    landfill_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (landfill_id, user_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
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
    sts_id integer,
    PRIMARY KEY (vehicle_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO public."Vehicle" (registration, type, capacity, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded) VALUES 
    ('Dhaka Metro 1', 'Open Truck', 3, 10, 5),
    ('Dhaka Metro 2', 'Dump Truck', 5, 10, 5),
    ('Dhaka Metro 3', 'Compactor', 7, 10, 5),
    ('Dhaka Metro 4', 'Container Carrier', 7, 10, 5);

CREATE TABLE public."Landfill_Entry"
(
    landfill_entry_id serial NOT NULL,
    landfill_id integer NOT NULL,
    manager_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time timestamp NOT NULL,
    departure_time timestamp,
    volume double precision NOT NULL,
    PRIMARY KEY (landfill_entry_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE public."STS_Entry"
(
    sts_entry_id serial NOT NULL,
    sts_id integer NOT NULL,
    manager_id integer NOT NULL,
    entry_time timestamp NOT NULL,
    departure_time timestamp,
    vehicle_id integer,
    volume double precision NOT NULL,
    PRIMARY KEY (sts_entry_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
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


CREATE TABLE public."Vehicle_Route"
(
    route_id serial NOT NULL,
    landfill_id integer NOT NULL,
    sts_id integer NOT NULL,
    direction text NOT NULL,
    distance double precision NOT NULL,
    duration double precision NOT NULL,
    PRIMARY KEY (route_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


INSERT INTO public."Permission" ("name",details) VALUES
        ('LOGIN','Login permission'),
        ('CREATE_USER','Create User permission'),
        ('UPDATE_USER','Update User permission'),
        ('DELETE_USER','Delete User permission'),
        ('VIEW_USER','View User permission'),
        ('CREATE_ROLE','Create Role permission'),
        ('UPDATE_ROLE','Update Role permission'),
        ('DELETE_ROLE','Delete Role permission'),
        ('VIEW_ROLE','View Role permission'),
        ('CREATE_PERMISSION','Create Permission permission'),
        ('UPDATE_PERMISSION','Update Permission permission'),
        ('DELETE_PERMISSION','Delete Permission permission'),
        ('VIEW_PERMISSION','View Permission permission'),
        ('ASSIGN_ROLE','Assign Role permission'),
        ('UNASSIGN_ROLE','Unassign Role permission'),
        ('ASSIGN_PERMISSION','Assign Permission permission'),
        ('UNASSIGN_PERMISSION','Unassign Permission permission'),
        ('CREATE_LANDFILL','Create Landfill permission'),
        ('UPDATE_LANDFILL','Update Landfill permission'),
        ('DELETE_LANDFILL','Delete Landfill permission'),
        ('VIEW_LANDFILL','View Landfill permission'),
        ('ASSIGN_LANDFILL_MANAGER','Assign Landfill Manager permission'),
        ('UNASSIGN_LANDFILL_MANAGER','Unassign Landfill Manager permission'),
        ('VIEW_LANDFILL_MANAGER','View Landfill Managers'),
        ('CREATE_STS','Create STS permission'),
        ('UPDATE_STS','Update STS permission'),
        ('DELETE_STS','Delete STS permission'),
        ('VIEW_STS','View STS permission'),
        ('VIEW_ALL_STS','View All STS permission'),
        ('ASSIGN_STS_MANAGER','Assign STS Manager permission'),
        ('UNASSIGN_STS_MANAGER','Unassign STS Manager permission'),
        ('VIEW_STS_MANAGER','View STS Managers'),
        ('ASSIGN_VEHCILE','Assign Vehicle to STS'),
        ('UNASSIGN_VEHICLE','Unassign Vehicle from STS'),
        ('CREATE_VEHICLE','Create Vehicle permission'),
        ('UPDATE_VEHICLE','Update Vehicle permission'),
        ('DELETE_VEHICLE','Delete Vehicle permission'),
        ('VIEW_VEHICLE','View Vehicle permission'),
        ('VIEW_ALL_VEHICLE','View All Vehicle permission'),
        ('CREATE_LANDFILL_ENTRY','Create Landfill Entry permission'),
        ('UPDATE_LANDFILL_ENTRY','Update Landfill Entry permission'),
        ('DELETE_LANDFILL_ENTRY','Delete Landfill Entry permission'),
        ('VIEW_LANDFILL_ENTRY','View Landfill Entry permission'),
        ('CREATE_STS_ENTRY','Create STS Entry permission'),
        ('UPDATE_STS_ENTRY','Update STS Entry permission'),
        ('DELETE_STS_ENTRY','Delete STS Entry permission'),
        ('VIEW_STS_ENTRY','View STS Entry permission'),
        ('CREATE_BILL','Create Bill permission'),
        ('UPDATE_BILL','Update Bill permission'),
        ('DELETE_BILL','Delete Bill permission'),
        ('VIEW_BILL','View Bill permission');


-- login permission to all user except unassigned
INSERT INTO public."Permission_Role" (role_name, permission_name) VALUES 
    ('STS_MANAGER', 'LOGIN'),
    ('LANDFILL_MANAGER', 'LOGIN');


-- nested query to get all permissions and give them to system admin
INSERT INTO public."Permission_Role" (role_name, permission_name)
    SELECT 'SYSTEM_ADMIN', name FROM public."Permission";

-- sts manager permissions
-- view vehicle, view sts, view sts entry, create sts entry
INSERT INTO public."Permission_Role" (role_name, permission_name)VALUES 
    ('STS_MANAGER', 'VIEW_VEHICLE'),
    ('STS_MANAGER', 'VIEW_STS'),
    ('STS_MANAGER', 'VIEW_STS_ENTRY'),
    ('STS_MANAGER', 'CREATE_STS_ENTRY'),
    ('STS_MANAGER', 'UPDATE_STS_ENTRY');



