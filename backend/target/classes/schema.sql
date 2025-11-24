-- === CASE GROUPS (Collections) ===
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

-- === ITEMS (True Crime Cases) ===
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

-- === GROUP_ITEMS (Links cases to collections) ===
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

-- === USERS (Minimal demo account) ===
CREATE TABLE IF NOT EXISTS users (
  id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role     VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
