PGDMP  
    )                }            ServiciosAPI    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    49745    ServiciosAPI    DATABASE     �   CREATE DATABASE "ServiciosAPI" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "ServiciosAPI";
                postgres    false                        2615    49807    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5            �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            H           1247    49809 
   MetodoHttp    TYPE     i   CREATE TYPE public."MetodoHttp" AS ENUM (
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH'
);
    DROP TYPE public."MetodoHttp";
       public          postgres    false    5            �            1259    49819    apis    TABLE       CREATE TABLE public.apis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    endpoint character varying(500) NOT NULL,
    metodo public."MetodoHttp" NOT NULL,
    url text NOT NULL,
    parametros jsonb DEFAULT '{}'::jsonb,
    headers jsonb DEFAULT '{}'::jsonb,
    auth character varying(50),
    creado_en timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.apis;
       public         heap    postgres    false    5    840            �          0    49819    apis 
   TABLE DATA           �   COPY public.apis (id, nombre, descripcion, endpoint, metodo, url, parametros, headers, auth, creado_en, actualizado_en) FROM stdin;
    public          postgres    false    215   P       X           2606    49830    apis apis_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.apis
    ADD CONSTRAINT apis_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.apis DROP CONSTRAINT apis_pkey;
       public            postgres    false    215            Y           1259    49831    idx_apis_nombre    INDEX     B   CREATE INDEX idx_apis_nombre ON public.apis USING btree (nombre);
 #   DROP INDEX public.idx_apis_nombre;
       public            postgres    false    215            �   �  x���ێ�6��� |J�H�|�n�mP�]`4)#r��FQv�}�<B^�C��v5�ѕ0���q��i�-T����"策7&J�]]�<��~�#�	Ɛ��tt���,�=�؉����@�>�q_�IF'!��e�Mhf燐�?$�/�$w�<�M�8��%9��������뽷�ް���������۹!�;�@Mm)*��av��������Q�+?�8���i\�8��,�K-rھ���[�?�`�@�/s��"/��\TL�)7J��֗�+QU*[r�tI�+��ق祒�md�ZL��oI�޼N�ã�iF�` ��3�O�)r���#N�|�$�o��(���%�!��Sv}�����o��
> ��Oo����V���*�K�Un*,W�F�[���Q�M���A���0�a`/͝Od�q:`K�>�M8:�����G�Gև$)4����_`�C2��l������~����j*s.�\$�~�TmT�
�\���\t u�E)-נoۺ�n���&�J�\��^��C�=���&�Z�	�����1ɺ�M0X�4-�m<K7����ß��8�滨J
������l�z�t���}eS(�
n%*�;�z�,/j!��Y�<�a���m	�~�7�3ӻ=0�� =���6�#�<�<�I�����7��Qf�j��K�������	"���Z���\���0�FUi��S6E܂�iV���j�7����     