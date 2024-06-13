-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COMPANY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABERTA', 'ANDAMENTO', 'FECHADA');

-- CreateEnum
CREATE TYPE "TypeOrder" AS ENUM ('PREVENTIVA', 'CORRETIVA');

-- CreateEnum
CREATE TYPE "StateRelBlocked" AS ENUM ('OPEN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "openorders" (
    "id" TEXT NOT NULL,
    "num_id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type_order" "TypeOrder" NOT NULL,
    "equipament" TEXT NOT NULL,
    "creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_prog" TIMESTAMP NOT NULL,
    "end_prog" TIMESTAMP NOT NULL,
    "responsible" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "end_enc" TIMESTAMP NOT NULL,
    "responsible_enc" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "openorders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relservice" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "line01" TEXT NOT NULL,
    "line02" TEXT NOT NULL,
    "line03" TEXT NOT NULL,
    "line04" TEXT NOT NULL,
    "line05" TEXT NOT NULL,
    "line06" TEXT NOT NULL,
    "line07" TEXT NOT NULL,
    "line08" TEXT NOT NULL,
    "line09" TEXT NOT NULL,
    "line10" TEXT NOT NULL,
    "line11" TEXT NOT NULL,
    "line12" TEXT NOT NULL,
    "line13" TEXT NOT NULL,
    "line14" TEXT NOT NULL,
    "creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_prog" TIMESTAMP NOT NULL,
    "end_prog" TIMESTAMP NOT NULL,
    "responsible" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "relservice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relblocked" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "equipament" TEXT NOT NULL,
    "panel" TEXT NOT NULL,
    "state" "StateRelBlocked" NOT NULL,
    "responsible" TEXT NOT NULL,
    "observation" TEXT NOT NULL,

    CONSTRAINT "relblocked_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "relservice" ADD CONSTRAINT "relservice_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "openorders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relblocked" ADD CONSTRAINT "relblocked_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "relservice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
