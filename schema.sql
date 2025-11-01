-- FakeMRR Database Schema
-- Run this in Vercel Postgres Query tab after creating the database

CREATE TABLE IF NOT EXISTS startups (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    founder_name VARCHAR(255) NOT NULL,
    twitter VARCHAR(100),
    website VARCHAR(500),
    mrr BIGINT DEFAULT 0,
    total_revenue BIGINT NOT NULL,
    growth_rate INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_total_revenue ON startups(total_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_mrr ON startups(mrr DESC);
CREATE INDEX IF NOT EXISTS idx_created_at ON startups(created_at DESC);

-- Insert sample data
INSERT INTO startups (company_name, founder_name, twitter, website, mrr, total_revenue, growth_rate) VALUES
('AI-Powered Blockchain NFT Metaverse Solutions', 'Chad Thiel', '@web5ceo', 'https://aiblockchainmetaverse.xyz', 420690, 69420000, 10000),
('Uber But For Saying You''re Building Uber For X', 'Elon Jobs', '@disruptor9000', 'https://uberbutfor.io', 333333, 8888888, 999),
('GrindCoin', 'Gary Hustle Jr.', '@rise_and_grind', 'https://grindcoin.bro', 180000, 5400000, 500),
('DropshipGPT', 'Tai Lopez', '@knawledge', '', 99999, 3700000, 420),
('No-Code SaaS Builder For Building No-Code SaaS', 'Indie Pete', '@shipdaily', 'https://nocodeno.codes', 77777, 2500000, 350),
('TikTok But For B2B Enterprise SaaS', 'Pivot Master', '@pivotszn', 'https://tikb2b.io', 55000, 1800000, 800),
('Passive Income Academy AI Course Generator', 'Graham Cardone', '@10xcashflow', 'https://passive-passive.money', 42069, 1337000, 666),
('LinkedIn Motivational Quote Generator As A Service', 'Simon Sinatra', '@thoughtleader', 'https://linked.in/jk-its-fake', 33333, 999999, 200),
('Sleep When You''re Dead Energy Drink', 'Andrew Taint', '@alpha_grindset', 'https://neverrest.biz', 25000, 750000, 300),
('Crypto Bro Mentorship NFT DAO', 'Satoshi McAfee', '@wagmi4lyfe', '', 0, 500000, 1200),
('Solopreneur Loneliness As A Service', 'Pieter Levels-Adjacent', '@nomadcoder', 'https://lonely.af', 15000, 450000, 150),
('Twitter Thread To PDF Converter', 'Sahil Bloom Parody', '@threadboi', 'https://threadtopdf.lol', 12000, 360000, 180),
('Fake Stripe Dashboard Screenshot Generator', 'Marc Flexington', '@revenueflexer', 'https://fakemrr.com', 8888, 266640, 999),
('YC Rejection Letter NFT Marketplace', 'Paul Griftham', '@notinYC', 'https://rejectedbutrich.com', 6969, 210000, 420),
('Cold Email Spam But We Call It Outreach', 'Jason Lemkin Wannabe', '@saasjesus', 'https://definitely-not-spam.io', 4200, 126000, 250);
