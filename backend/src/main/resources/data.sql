-- =========================================================
--  TRUE CRIME ARCHIVE — COMPLETE DATA.SQL (PART 1)
--  DATABASE INITIALIZATION + SCHEMA + USERS
-- =========================================================

-- Select the correct database
USE truecrime;

-- =========================================================
-- DROP TABLES IN CORRECT ORDER (to avoid FK constraint issues)
-- =========================================================
DROP TABLE IF EXISTS group_items;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS case_groups;
DROP TABLE IF EXISTS users;

-- =========================================================
-- CREATE TABLES
-- =========================================================

-- === USERS ===
CREATE TABLE IF NOT EXISTS users (
  id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role     VARCHAR(50)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- === CASE GROUPS ===
CREATE TABLE IF NOT EXISTS case_groups (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  description TEXT NULL,
  visibility  VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
  owner_id    BIGINT NULL,
  created_at  DATETIME NULL,
  updated_at  DATETIME NULL,
  image_url   VARCHAR(500) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- === ITEMS ===
CREATE TABLE IF NOT EXISTS items (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_id       BIGINT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT NULL,
  victim_name    VARCHAR(255) NULL,
  location_city  VARCHAR(255) NULL,
  location_state VARCHAR(255) NULL,
  status         VARCHAR(20) NULL,
  visibility     VARCHAR(20) NULL,
  year           INT NULL,
  image_url      VARCHAR(512) NULL,
  wiki_url       VARCHAR(512) NULL,
  created_at     DATETIME NULL,
  updated_at     DATETIME NULL,
  UNIQUE KEY uq_item_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- === GROUP_ITEMS ===
CREATE TABLE IF NOT EXISTS group_items (
  id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  group_id BIGINT NOT NULL,
  item_id  BIGINT NOT NULL,
  UNIQUE KEY uq_group_item (group_id, item_id),
  KEY idx_group (group_id),
  KEY idx_item  (item_id),
  CONSTRAINT fk_gi_group FOREIGN KEY (group_id) REFERENCES case_groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_gi_item  FOREIGN KEY (item_id)  REFERENCES items(id)       ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================
-- INSERT USERS (Sample demo accounts)
-- =========================================================
INSERT INTO users (id, username, password, role) VALUES
  (3, 'truecrimefan', 'password', 'ROLE_USER'),
  (4, 'coldcasequeen', 'password', 'ROLE_USER'),
  (5, 'serialsleuth', 'password', 'ROLE_USER'),
  (6, 'unsolvedhunter', 'password', 'ROLE_USER'),
  (7, 'missingfiles', 'password', 'ROLE_USER'),
  (8, 'casecollector', 'password', 'ROLE_USER'),
  (9, 'crimebuff42', 'password', 'ROLE_USER'),
  (10, 'darkhistorynerd', 'password', 'ROLE_USER'),
  (11, 'forensicfreak', 'password', 'ROLE_USER'),
  (12, 'investigator_john', 'password', 'ROLE_USER')
ON DUPLICATE KEY UPDATE username = VALUES(username);
-- =========================================================
-- INSERT CASE GROUPS (Main categories + user collections)
-- =========================================================


-- === Public User Collections (21–30) ===
INSERT INTO case_groups (id, name, description, visibility, owner_id, image_url, created_at, updated_at) VALUES
  (21, 'Unsolved Legends',       'A curated public list by truecrimefan.',            'PUBLIC', 3,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (22, 'Cold Case Favorites',    'A curated public list by coldcasequeen.',           'PUBLIC', 4,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (23, 'Serial Killer Casebook', 'A curated public list by serialsleuth.',            'PUBLIC', 5,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (24, 'Perpetual Mysteries',    'A curated public list by unsolvedhunter.',          'PUBLIC', 6,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (25, 'Disappeared & Missing',  'A curated public list by missingfiles.',            'PUBLIC', 7,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (26, 'Notorious Files',        'A curated public list by casecollector.',           'PUBLIC', 8,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (27, 'Deep Dives',             'A curated public list by crimebuff42.',             'PUBLIC', 9,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (28, 'Dark History Picks',     'A curated public list by darkhistorynerd.',         'PUBLIC', 10,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (29, 'Forensic Puzzles',       'A curated public list by forensicfreak.',           'PUBLIC', 11,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW()),
  (30, 'Investigator''s Choice', 'A curated public list by investigator_john.',       'PUBLIC', 12,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  description = VALUES(description),
  updated_at  = NOW();

-- =========================================================
-- INSERT ITEMS (21–100) — CORE TRUE CRIME CASES
-- =========================================================

INSERT INTO items (id, owner_id, title, description, victim_name, location_city, location_state, status, visibility, year, image_url, wiki_url, created_at, updated_at)
VALUES
  (21, 2, 'Zodiac Killer',
   'Unsolved serial killer case in Northern California.',
   'Various', 'San Francisco', 'CA', 'UNSOLVED', 'PUBLIC', 1969,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Zodiac_Killer', NOW(), NOW()),

  (22, 2, 'DB Cooper',
   'Unidentified hijacker who parachuted from a plane with ransom money in 1971.',
   'Unknown', 'Portland', 'OR', 'UNSOLVED', 'PUBLIC', 1971,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/D._B._Cooper', NOW(), NOW()),

  (23, 2, 'JonBenét Ramsey',
   'High-profile 1996 child homicide case from Boulder, Colorado.',
   'JonBenét Ramsey', 'Boulder', 'CO', 'UNSOLVED', 'PUBLIC', 1996,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/JonBen%C3%A9t_Ramsey_case', NOW(), NOW()),

  (24, 2, 'The Boy in the Box',
   'Unidentified boy found dead in a box in Philadelphia in 1957.',
   'Unknown', 'Philadelphia', 'PA', 'UNSOLVED', 'PUBLIC', 1957,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Boy_in_the_Box_(Philadelphia)', NOW(), NOW()),

  (25, 2, 'Jack the Ripper',
   'Infamous unidentified serial killer in London''s Whitechapel district.',
   'Various', 'London', 'UK', 'UNSOLVED', 'PUBLIC', 1888,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Jack_the_Ripper', NOW(), NOW()),


  -- Missing Persons Core List (31–35)
  (31, 2, 'Madeleine McCann',
   '2007 disappearance of a young girl from a holiday apartment in Portugal.',
   'Madeleine McCann', 'Praia da Luz', 'Portugal', 'OPEN', 'PUBLIC', 2007,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Madeleine_McCann', NOW(), NOW()),

  (32, 2, 'Maura Murray',
   'College student who disappeared after a car crash in 2004.',
   'Maura Murray', 'Haverhill', 'NH', 'OPEN', 'PUBLIC', 2004,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Maura_Murray', NOW(), NOW()),

  (33, 2, 'Brian Shaffer',
   'Medical student who vanished from a Columbus bar in 2006.',
   'Brian Shaffer', 'Columbus', 'OH', 'OPEN', 'PUBLIC', 2006,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Brian_Shaffer', NOW(), NOW()),

  (34, 2, 'Tara Calico',
   'New Mexico woman who disappeared while biking in 1988.',
   'Tara Calico', 'Belen', 'NM', 'OPEN', 'PUBLIC', 1988,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Tara_Calico', NOW(), NOW()),

  (35, 2, 'Etan Patz',
   'Notable missing child case from 1979 New York City.',
   'Etan Patz', 'New York City', 'NY', 'CLOSED', 'PUBLIC', 1979,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Etan_Patz', NOW(), NOW()),


  -- Serial Killer Core Cases (41–46)
  (41, 2, 'Ted Bundy',
   'Notorious American serial killer active in the 1970s.',
   'Various', 'Seattle', 'WA', 'CLOSED', 'PUBLIC', 1978,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Ted_Bundy', NOW(), NOW()),

  (42, 2, 'Jeffrey Dahmer',
   'Serial killer responsible for numerous murders.',
   'Various', 'Milwaukee', 'WI', 'CLOSED', 'PUBLIC', 1991,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Jeffrey_Dahmer', NOW(), NOW()),

  (43, 2, 'John Wayne Gacy',
   'Serial killer known as the Killer Clown.',
   'Various', 'Chicago', 'IL', 'CLOSED', 'PUBLIC', 1978,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/John_Wayne_Gacy', NOW(), NOW()),

  (44, 2, 'Richard Ramirez',
   'Night Stalker serial killer active in California.',
   'Various', 'Los Angeles', 'CA', 'CLOSED', 'PUBLIC', 1985,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Richard_Ramirez', NOW(), NOW()),

  (45, 2, 'Aileen Wuornos',
   'Serial killer who murdered several men in Florida.',
   'Various', 'Daytona Beach', 'FL', 'CLOSED', 'PUBLIC', 1990,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Aileen_Wuornos', NOW(), NOW()),

  (46, 2, 'Adnan Syed',
   'Baltimore murder case of Hae Min Lee; conviction later vacated.',
   'Hae Min Lee', 'Baltimore', 'MD', 'CLOSED', 'PUBLIC', 1999,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Adnan_Syed', NOW(), NOW());

-- =========================================================
-- INSERT ITEMS (101–166) — EXPANDED TRUE CRIME CASE SET
-- =========================================================

INSERT INTO items (id, owner_id, title, description, victim_name, location_city, location_state, status, visibility, year, image_url, wiki_url, created_at, updated_at)
VALUES
  (101, 3, 'Black Dahlia (Elizabeth Short)',
   'Unsolved 1947 Los Angeles murder of aspiring actress Elizabeth Short.',
   'Elizabeth Short', 'Los Angeles', 'CA', 'UNSOLVED', 'PUBLIC', 1947,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Black_Dahlia', NOW(), NOW()),

  (102, 4, 'Doodler',
   'Unidentified serial killer who targeted men in 1970s San Francisco.',
   'Various', 'San Francisco', 'CA', 'UNSOLVED', 'PUBLIC', 1975,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/The_Doodler', NOW(), NOW()),

  (103, 5, 'Isdal Woman',
   'Unidentified woman found dead in Norway’s Isdalen Valley in 1970.',
   'Unknown', 'Bergen', 'Norway', 'UNSOLVED', 'PUBLIC', 1970,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Isdal_Woman', NOW(), NOW()),

  (104, 6, 'Tamam Shud (Somerton Man)',
   'Unidentified man found in 1948 on Somerton Beach, Australia.',
   'Unknown', 'Adelaide', 'Australia', 'UNSOLVED', 'PUBLIC', 1948,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Tamam_Shud_case', NOW(), NOW()),

  (105, 7, 'Long Island Serial Killer (LISK)',
   'Unidentified killer linked to multiple victims along Ocean Parkway.',
   'Various', 'Gilgo Beach', 'NY', 'OPEN', 'PUBLIC', 2010,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Long_Island_serial_killings', NOW(), NOW()),

  (106, 8, 'Setagaya Family Murders',
   '2000 unsolved murder of a family of four in Tokyo.',
   'Miyazawa family', 'Tokyo', 'Japan', 'UNSOLVED', 'PUBLIC', 2000,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Setagaya_family_murders', NOW(), NOW()),

  (107, 9, 'West Mesa Bone Collector',
   'Unsolved murders where remains of 11 women were found in 2009.',
   'Various', 'Albuquerque', 'NM', 'UNSOLVED', 'PUBLIC', 2009,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/West_Mesa_Bone_Collector', NOW(), NOW()),

  (108, 10, 'Oakland County Child Killer',
   '1976–1977 murders of at least four children in Michigan.',
   'Various', 'Oakland County', 'MI', 'UNSOLVED', 'PUBLIC', 1977,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Oakland_County_Child_Killer', NOW(), NOW()),

  (109, 11, 'Texarkana Moonlight Murders',
   '1946 attacks by the “Phantom Killer” across Texas–Arkansas border.',
   'Various', 'Texarkana', 'TX/AR', 'UNSOLVED', 'PUBLIC', 1946,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Texarkana_Moonlight_Murders', NOW(), NOW()),

  (110, 12, 'Tylenol Murders',
   '1982 cyanide-laced Tylenol poisonings in Chicago.',
   'Various', 'Chicago', 'IL', 'UNSOLVED', 'PUBLIC', 1982,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Chicago_Tylenol_murders', NOW(), NOW()),

  (111, 3, 'Circleville Letters',
   'Anonymous threatening letters terrorized an Ohio town for years.',
   'Various', 'Circleville', 'OH', 'OPEN', 'PUBLIC', 1976,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Circleville_letters', NOW(), NOW()),

  (112, 4, 'Girl Scout Murders (Oklahoma)',
   '1977 murders of three girls at Camp Scott summer camp.',
   'Three campers', 'Mayes County', 'OK', 'UNSOLVED', 'PUBLIC', 1977,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Oklahoma_Girl_Scouts_murders', NOW(), NOW()),

  (113, 5, 'Taman Shud Rubaiyat Code',
   'A cryptic code linked to the Somerton Man case found in a book.',
   'Unknown', 'Adelaide', 'Australia', 'UNSOLVED', 'PUBLIC', 1948,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Tamam_Shud_case#Code_and_book', NOW(), NOW()),

  (114, 6, 'Who Put Bella in the Wych Elm?',
   'Unidentified remains found in a tree in 1943 in Worcestershire.',
   'Unknown', 'Wychbury Hill', 'UK', 'UNSOLVED', 'PUBLIC', 1943,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Who_put_Bella_in_the_Wych_Elm%3F', NOW(), NOW()),

  (115, 7, 'Boston Strangler (disputed)',
   '1960s Boston murders; attribution remains debated.',
   'Various', 'Boston', 'MA', 'OPEN', 'PUBLIC', 1964,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Boston_Strangler', NOW(), NOW()),

  (116, 8, 'Hammersmith Nude Murders',
   'Unsolved murders of sex workers in 1960s London.',
   'Various', 'London', 'UK', 'UNSOLVED', 'PRIVATE', 1965,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Hammersmith_Nude_Murders', NOW(), NOW()),

  (117, 9, 'Keddie Cabin Murders',
   '1981 murders in a rural California cabin; case partially unresolved.',
   'Various', 'Keddie', 'CA', 'OPEN', 'PUBLIC', 1981,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Keddie_murders', NOW(), NOW()),

  (118, 10, 'Boys on the Tracks',
   '1987 case of two teens found on railway tracks; possible coverup.',
   'Henry & Ives', 'Alexander', 'AR', 'OPEN', 'PUBLIC', 1987,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Murder_of_Don_Henry_and_Kevin_Ives', NOW(), NOW()),

  (119, 11, 'Ray Gricar Disappearance',
   'Pennsylvania district attorney vanished in 2005; car found by river.',
   'Ray Gricar', 'Lewisburg', 'PA', 'OPEN', 'PUBLIC', 2005,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Ray_Gricar', NOW(), NOW()),

  (120, 12, 'Tammy Jo Alexander',
   'Teen found murdered in 1979; identified in 2015; killer unknown.',
   'Tammy Jo Alexander', 'Caledonia', 'NY', 'UNSOLVED', 'PUBLIC', 1979,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Murder_of_Tammy_Jo_Alexander', NOW(), NOW()),

  (121, 3, 'Boulder Jane Doe',
   '1954 unidentified homicide victim in Colorado.',
   'Unknown', 'Boulder', 'CO', 'UNSOLVED', 'PUBLIC', 1954,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Boulder_Jane_Doe', NOW(), NOW()),

  (122, 4, 'Grateful Doe',
   'Unidentified 1995 crash victim; later identified as Jason Callahan.',
   'Jason Callahan', 'Emporia', 'VA', 'CLOSED', 'PUBLIC', 1995,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Jason_Callahan', NOW(), NOW()),

  (123, 5, 'Springfield Three',
   '1992 disappearance of two women and a teen from Missouri.',
   'Streeter, McCall, Levitt', 'Springfield', 'MO', 'OPEN', 'PUBLIC', 1992,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/The_Springfield_Three', NOW(), NOW()),

  (124, 6, 'Colonial Parkway Murders',
   '1986–1989 series of murders in Virginia.',
   'Various', 'Virginia', 'VA', 'OPEN', 'PUBLIC', 1989,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Colonial_Parkway_murders', NOW(), NOW()),

  (125, 7, 'Servant Girl Annihilator',
   '1884–85 Austin, TX serial attacks; identity unknown.',
   'Various', 'Austin', 'TX', 'UNSOLVED', 'PUBLIC', 1885,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Servant_Girl_Annihilator', NOW(), NOW()),

  (126, 8, 'Tybee Island Jane Doe',
   'Unidentified body found near Tybee Island, Georgia, in 1993.',
   'Unknown', 'Tybee Island', 'GA', 'UNSOLVED', 'PUBLIC', 1993,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/List_of_unidentified_murder_victims_in_the_United_States#Georgia', NOW(), NOW()),

  (127, 9, 'A6 Murder (Hanratty)',
   '1961 UK murder case with continuing controversy.',
   'Michael Gregsten', 'Bedfordshire', 'UK', 'OPEN', 'PUBLIC', 1961,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/A6_murder', NOW(), NOW()),

  (128, 10, 'Burger Chef Murders',
   '1978 Indianapolis fast-food crew abducted and murdered.',
   'Various', 'Indianapolis', 'IN', 'UNSOLVED', 'PUBLIC', 1978,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Burger_Chef_murders', NOW(), NOW()),

  (129, 11, 'Whitechapel Murders (non-Ripper)',
   'Series of murders in same district as Ripper, some unsolved.',
   'Various', 'London', 'UK', 'UNSOLVED', 'PUBLIC', 1891,
   'https://upload.wikimedia.org/wikipedia/commons/3/3b/Cold_Case_Files_logo.png',
   'https://en.wikipedia.org/wiki/Whitechapel_murders', NOW(), NOW()),

  (130, 12, 'Brianna Maitland',
   '17-year-old vanished in 2004; car found backed into building.',
   'Brianna Maitland', 'Montgomery', 'VT', 'OPEN', 'PUBLIC', 2004,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Brianna_Maitland', NOW(), NOW()),

  (131, 3, 'Amy Lynn Bradley',
   'Cruise-ship disappearance in 1998 near Curaçao.',
   'Amy Lynn Bradley', 'Off Curaçao', 'Caribbean', 'OPEN', 'PUBLIC', 1998,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.m.wikipedia.org/wiki/Disappearance_of_Amy_Lynn_Bradley', NOW(), NOW()),

  (132, 4, 'Natalee Holloway',
   'Teen disappeared in Aruba in 2005; widely publicized case.',
   'Natalee Holloway', 'Oranjestad', 'Aruba', 'OPEN', 'PUBLIC', 2005,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Natalee_Holloway', NOW(), NOW()),

  (133, 5, 'Kyron Horman',
   '7-year-old disappeared from Portland school in 2010.',
   'Kyron Horman', 'Portland', 'OR', 'OPEN', 'PRIVATE', 2010,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Kyron_Horman', NOW(), NOW()),

  (134, 6, 'Lars Mittank',
   'German tourist disappeared in Bulgaria in 2014.',
   'Lars Mittank', 'Varna', 'Bulgaria', 'OPEN', 'PUBLIC', 2014,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Lars_Mittank', NOW(), NOW()),

  (135, 7, 'Phoenix Coldon',
   '2011 disappearance from St. Louis County; car found abandoned.',
   'Phoenix Coldon', 'Spanish Lake', 'MO', 'OPEN', 'PUBLIC', 2011,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Phoenix_Coldon', NOW(), NOW()),

  (136, 8, 'Sophie Sergie',
   '1993 murder of student; case went cold until 2019 arrest.',
   'Sophie Sergie', 'Fairbanks', 'AK', 'OPEN', 'PUBLIC', 1993,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Murder_of_Sophie_Sergie', NOW(), NOW()),

  (137, 9, 'Patricia Meehan',
   '1989 disappearance after a car accident in Montana.',
   'Patricia Meehan', 'Circle', 'MT', 'OPEN', 'PUBLIC', 1989,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Patricia_Meehan', NOW(), NOW()),

  (138, 10, 'Ray Rivera',
   '2006 mysterious death linked to Belvedere Hotel in Baltimore.',
   'Rey Rivera', 'Baltimore', 'MD', 'OPEN', 'PUBLIC', 2006,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Death_of_Rey_Rivera', NOW(), NOW()),

  (139, 11, 'Zebb Quinn',
   '2000 North Carolina disappearance; suspicious clues left behind.',
   'Zebb Quinn', 'Asheville', 'NC', 'OPEN', 'PUBLIC', 2000,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Zebb_Quinn', NOW(), NOW()),

  (140, 12, 'Flight MH370',
   '2014 disappearance of Malaysia Airlines Flight 370.',
   '239 aboard', 'En route', 'International', 'OPEN', 'PUBLIC', 2014,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Malaysia_Airlines_Flight_370', NOW(), NOW()),

  (141, 3, 'Jodi Huisentruit',
   'TV anchor disappeared in 1995 from Iowa apartment complex.',
   'Jodi Huisentruit', 'Mason City', 'IA', 'OPEN', 'PUBLIC', 1995,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Jodi_Huisentruit', NOW(), NOW()),

  (142, 4, 'Relisha Rudd',
   '8-year-old disappeared in 2014 in Washington, D.C.',
   'Relisha Rudd', 'Washington', 'DC', 'OPEN', 'PUBLIC', 2014,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Relisha_Rudd', NOW(), NOW()),

  (143, 5, 'Timmothy Pitzen',
   '6-year-old disappeared in 2011 after a trip with his mother.',
   'Timmothy Pitzen', 'Aurora', 'IL', 'OPEN', 'PUBLIC', 2011,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Timmothy_Pitzen', NOW(), NOW()),

  (144, 6, 'Paul Whipkey',
   'Army lieutenant disappeared in 1958; car found in desert.',
   'Paul Whipkey', 'Monterey', 'CA', 'OPEN', 'PUBLIC', 1958,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Paul_Whipkey', NOW(), NOW()),

  (145, 7, 'David Lewis',
   'Texas accountant disappeared in 1993; body later found.',
   'David Lewis', 'Amarillo', 'TX', 'CLOSED', 'PUBLIC', 1993,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_David_Lewis', NOW(), NOW()),

  (146, 8, 'Jason Jolkowski',
   '19-year-old disappeared walking to meet ride for work.',
   'Jason Jolkowski', 'Omaha', 'NE', 'OPEN', 'PRIVATE', 2001,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Jason_Jolkowski', NOW(), NOW()),

  (147, 9, 'Morgan Nick',
   '6-year-old abducted from ballpark in 1995.',
   'Morgan Nick', 'Alma', 'AR', 'OPEN', 'PUBLIC', 1995,
   'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amber_Hagerman_memorial_site.jpg',
   'https://en.wikipedia.org/wiki/Disappearance_of_Morgan_Nick', NOW(), NOW()),

  (148, 10, 'BTK (Dennis Rader)',
   'Kansas serial killer active 1974–1991.',
   'Various', 'Wichita', 'KS', 'CLOSED', 'PUBLIC', 2005,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Dennis_Rader', NOW(), NOW()),

  (149, 11, 'Green River Killer (Gary Ridgway)',
   'Convicted of 49 murders; suspected of more.',
   'Various', 'Seattle', 'WA', 'CLOSED', 'PUBLIC', 2001,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Gary_Ridgway', NOW(), NOW()),

  (150, 12, 'Golden State Killer (Joseph DeAngelo)',
   'Identified via genetic genealogy; crimes in 70s–80s.',
   'Various', 'Sacramento', 'CA', 'CLOSED', 'PUBLIC', 2018,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Joseph_James_DeAngelo', NOW(), NOW()),

  (151, 3, 'Harold Shipman',
   'UK doctor who murdered numerous patients.',
   'Various', 'Hyde', 'UK', 'CLOSED', 'PUBLIC', 2000,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Harold_Shipman', NOW(), NOW()),

  (152, 4, 'Pedro Lopez',
   'Known as the Monster of the Andes; convicted of multiple murders.',
   'Various', 'Ambato', 'Ecuador', 'CLOSED', 'PUBLIC', 1980,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Pedro_L%C3%B3pez_(serial_killer)', NOW(), NOW()),

  (153, 5, 'Andrei Chikatilo',
   'Soviet serial killer known as the Butcher of Rostov.',
   'Various', 'Rostov', 'Russia', 'CLOSED', 'PUBLIC', 1994,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Andrei_Chikatilo', NOW(), NOW()),

  (154, 6, 'Albert Fish',
   'American serial killer and cannibal; executed in 1936.',
   'Various', 'New York City', 'NY', 'CLOSED', 'PRIVATE', 1936,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Albert_Fish', NOW(), NOW()),

  (155, 7, 'H.H. Holmes',
   'Chicago World’s Fair-era con artist and murderer.',
   'Various', 'Chicago', 'IL', 'CLOSED', 'PUBLIC', 1895,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/H._H._Holmes', NOW(), NOW()),

  (156, 8, 'Robert Pickton',
   'Canadian serial killer convicted of six murders.',
   'Various', 'Port Coquitlam', 'Canada', 'CLOSED', 'PUBLIC', 2007,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Robert_Pickton', NOW(), NOW()),

  (157, 9, 'Samuel Little',
   'Confessed to 93 murders across the U.S.',
   'Various', 'Nationwide', 'USA', 'CLOSED', 'PUBLIC', 2014,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Samuel_Little', NOW(), NOW()),

  (158, 10, 'David Berkowitz (Son of Sam)',
   'NYC shooter who terrorized city in 1976–77.',
   'Various', 'New York City', 'NY', 'CLOSED', 'PUBLIC', 1977,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/David_Berkowitz', NOW(), NOW()),

  (159, 11, 'Ed Kemper',
   'Co-ed killer known for murders in early 1970s California.',
   'Various', 'Santa Cruz', 'CA', 'CLOSED', 'PUBLIC', 1973,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Edmund_Kemper', NOW(), NOW()),

  (160, 12, 'Ed Gein',
   'Wisconsin murderer whose crimes inspired fictional characters.',
   'Various', 'Plainfield', 'WI', 'CLOSED', 'PUBLIC', 1957,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Ed_Gein', NOW(), NOW()),

  (161, 3, 'Joachim Kroll',
   'German serial killer active between 1955–1976.',
   'Various', 'Duisburg', 'Germany', 'CLOSED', 'PUBLIC', 1976,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Joachim_Kroll', NOW(), NOW()),

  (162, 4, 'Peter Sutcliffe (Yorkshire Ripper)',
   'UK serial killer convicted of murdering 13 women.',
   'Various', 'Yorkshire', 'UK', 'CLOSED', 'PUBLIC', 1981,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Peter_Sutcliffe', NOW(), NOW()),

  (163, 5, 'Nannie Doss',
   'American serial killer who murdered family members.',
   'Various', 'Tulsa', 'OK', 'CLOSED', 'PUBLIC', 1954,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Nannie_Doss', NOW(), NOW()),

  (164, 6, 'Fred and Rosemary West',
   'British couple who committed multiple murders.',
   'Various', 'Gloucester', 'UK', 'CLOSED', 'PUBLIC', 1994,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Fred_West', NOW(), NOW()),

  (165, 7, 'Richard Kuklinski',
   'Contract killer known as the Iceman.',
   'Various', 'New Jersey', 'NJ', 'CLOSED', 'PUBLIC', 1986,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Richard_Kuklinski', NOW(), NOW()),

  (166, 8, 'Randy Kraft',
   'Serial killer known as the Scorecard Killer.',
   'Various', 'Southern California', 'CA', 'CLOSED', 'PUBLIC', 1983,
   'https://upload.wikimedia.org/wikipedia/commons/4/45/Ted_Bundy_1975.jpg',
   'https://en.wikipedia.org/wiki/Randy_Steven_Kraft', NOW(), NOW());
   
-- =========================================================
-- INSERT GROUP_ITEMS — MAP ITEMS TO COLLECTIONS
-- =========================================================

-- === Main Categories (Cold Cases, Missing Persons, Serial Killers) ===
INSERT INTO group_items (group_id, item_id) VALUES
  -- Cold Cases group (11)
  (11, 101), (11, 102), (11, 103), (11, 104), (11, 105),
  (11, 106), (11, 107), (11, 108), (11, 109), (11, 110),
  (11, 111), (11, 112), (11, 113), (11, 114), (11, 115),
  (11, 116), (11, 117), (11, 118), (11, 119), (11, 120),
  (11, 121), (11, 122), (11, 123), (11, 124), (11, 125),
  (11, 126), (11, 127), (11, 128), (11, 129),

  -- Missing Persons group (12)
  (12, 130), (12, 131), (12, 132), (12, 133), (12, 134),
  (12, 135), (12, 136), (12, 137), (12, 138), (12, 139),
  (12, 140), (12, 141), (12, 142), (12, 143), (12, 144),
  (12, 145), (12, 146), (12, 147),

  -- Serial Killers group (13)
  (13, 148), (13, 149), (13, 150), (13, 151), (13, 152),
  (13, 153), (13, 154), (13, 155), (13, 156), (13, 157),
  (13, 158), (13, 159), (13, 160), (13, 161), (13, 162),
  (13, 163), (13, 164), (13, 165), (13, 166)
ON DUPLICATE KEY UPDATE group_id = group_id;


-- =========================================================
-- USER COLLECTIONS (21–30) — 5–7 items each
-- =========================================================

INSERT INTO group_items (group_id, item_id) VALUES
  -- User collection 21 (truecrimefan)
  (21, 101), (21, 102), (21, 103), (21, 104), (21, 105), (21, 106),

  -- User collection 22 (coldcasequeen)
  (22, 107), (22, 108), (22, 109), (22, 110), (22, 111), (22, 112),

  -- User collection 23 (serialsleuth)
  (23, 113), (23, 114), (23, 115), (23, 116), (23, 117), (23, 118),

  -- User collection 24 (unsolvedhunter)
  (24, 119), (24, 120), (24, 121), (24, 122), (24, 123), (24, 124),

  -- User collection 25 (missingfiles)
  (25, 125), (25, 126), (25, 127), (25, 128), (25, 129), (25, 130),

  -- User collection 26 (casecollector)
  (26, 131), (26, 132), (26, 133), (26, 134), (26, 135), (26, 136),

  -- User collection 27 (crimebuff42)
  (27, 137), (27, 138), (27, 139), (27, 140), (27, 141), (27, 142),

  -- User collection 28 (darkhistorynerd)
  (28, 143), (28, 144), (28, 145), (28, 146), (28, 147), (28, 148),

  -- User collection 29 (forensicfreak)
  (29, 149), (29, 150), (29, 151), (29, 152), (29, 153), (29, 154),

  -- User collection 30 (investigator_john)
  (30, 155), (30, 156), (30, 157), (30, 158), (30, 159), (30, 160)
ON DUPLICATE KEY UPDATE group_id = group_id;
