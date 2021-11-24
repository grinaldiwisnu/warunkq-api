create table if not exists users
(
	id int auto_increment primary key,
	fullname varchar(255) null,
	username varchar(255) not null,
	email varchar(100) not null,
	password varchar(255) not null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	updated_at timestamp default CURRENT_TIMESTAMP not null
);

create table if not exists categories
(
	id int auto_increment primary key,
	name varchar(60) not null,
	description varchar(255) null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	updated_at timestamp default CURRENT_TIMESTAMP not null,
	users_id int not null,
	constraint tb_users_tb_categories foreign key (users_id) references users (id)
);

create table if not exists orders
(
	id int auto_increment primary key,
	order_id varchar(50) null,
	total_price int(25) not null,
	status enum('success', 'cancel') default 'success' not null,
	cancel_reason text null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	updated_at timestamp default CURRENT_TIMESTAMP not null,
	users_id int not null,
	discount_amount int null,
	discount_total int(25) null,
	constraint transaction unique (order_id),
	constraint users_orders foreign key (users_id) references users (id)
);

create table if not exists orders_payment
(
	id int not null primary key,
	method enum('Cash', 'Transfer', 'E-Wallet') not null,
	total int(25) not null,
	note varchar(60) null,
	orders_id int not null,
	constraint orders_orders_payment foreign key (orders_id) references orders (id)
);

create table if not exists products
(
	id int auto_increment primary key,
	name varchar(255) not null,
	description text not null,
	image varchar(255) not null,
	price int(25) not null,
	sell_price int(25) not null,
	quantity int(25) not null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	updated_at timestamp default CURRENT_TIMESTAMP not null,
	users_id int not null,
	categories_id int default 1 not null,
	constraint tb_categories_tb_products foreign key (categories_id) references categories (id),
	constraint tb_users_tb_product foreign key (users_id) references users (id)
);

create table if not exists orders_detail
(
	id int auto_increment primary key,
	quantity int(25) not null,
	sub_total int(25) not null,
	orders_id varchar(50) null,
	products_id int not null,
	constraint tb_orders_tb_orders_detail foreign key (orders_id) references orders (order_id),
	constraint tb_products_tb_orders_detail foreign key (products_id) references products (id)
);

create table if not exists users_detail
(
	id int not null primary key,
	phone_number varchar(25) null,
	store_name varchar(60) null,
	store_address varchar(100) null,
	users_id int not null,
	constraint users_users_detail foreign key (users_id) references users (id)
);

