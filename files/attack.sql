CREATE TABLE public.attacks (
	id serial4 NOT NULL,
	"sourceCountry" varchar(5) NULL,
	"destinationCountry" varchar(5) NULL,
	"millisecond" int4 NULL,
	"type" varchar(50) NULL,
	"weight" int4 NULL,
	"attackTime" timestamptz NULL,
	CONSTRAINT datas_pkey PRIMARY KEY (id)
);