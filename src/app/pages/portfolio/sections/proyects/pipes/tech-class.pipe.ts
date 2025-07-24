import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'techClass',
 standalone: true
})
export class TechClassPipe implements PipeTransform {

 transform(tech: string): string {
   const techLower = tech.toLowerCase();

   // Frontend Frameworks
   if (techLower.includes('angular')) return 'tech-angular';
   if (techLower.includes('react')) return 'tech-react';
   if (techLower.includes('vue')) return 'tech-vue';
   if (techLower.includes('svelte')) return 'tech-svelte';
   if (techLower.includes('nextjs') || techLower.includes('next.js')) return 'tech-nextjs';
   if (techLower.includes('nuxt')) return 'tech-nuxt';

   // Languages
   if (techLower.includes('typescript')) return 'tech-typescript';
   if (techLower.includes('javascript')) return 'tech-javascript';
   if (techLower.includes('python')) return 'tech-python';
   if (techLower.includes('java') && !techLower.includes('javascript')) return 'tech-java';
   if (techLower.includes('php')) return 'tech-php';
   if (techLower.includes('dart')) return 'tech-dart';
   if (techLower.includes('c#') || techLower.includes('csharp')) return 'tech-csharp';
   if (techLower.includes('kotlin')) return 'tech-kotlin';
   if (techLower.includes('swift')) return 'tech-swift';
   if (techLower.includes('go') || techLower.includes('golang')) return 'tech-go';
   if (techLower.includes('rust')) return 'tech-rust';

   // Backend Frameworks
   if (techLower.includes('node') || techLower.includes('nodejs')) return 'tech-nodejs';
   if (techLower.includes('nestjs')) return 'tech-nestjs';
   if (techLower.includes('express')) return 'tech-express';
   if (techLower.includes('laravel')) return 'tech-laravel';
   if (techLower.includes('django')) return 'tech-django';
   if (techLower.includes('flask')) return 'tech-flask';
   if (techLower.includes('spring')) return 'tech-spring';
   if (techLower.includes('.net') || techLower.includes('dotnet')) return 'tech-dotnet';
   if (techLower.includes('fastapi')) return 'tech-fastapi';

   // Databases
   if (techLower.includes('mysql')) return 'tech-mysql';
   if (techLower.includes('postgresql') || techLower.includes('postgres')) return 'tech-postgresql';
   if (techLower.includes('mongodb') || techLower.includes('mongo')) return 'tech-mongodb';
   if (techLower.includes('firebase')) return 'tech-firebase';
   if (techLower.includes('redis')) return 'tech-redis';
   if (techLower.includes('sqlite')) return 'tech-sqlite';
   if (techLower.includes('oracle')) return 'tech-oracle';
   if (techLower.includes('supabase')) return 'tech-supabase';

   // Office & Automation
   if (techLower.includes('excel')) return 'tech-excel';
   if (techLower.includes('vba') || techLower.includes('macro')) return 'tech-vba';
   if (techLower.includes('power bi') || techLower.includes('powerbi')) return 'tech-powerbi';
   if (techLower.includes('office')) return 'tech-office';
   if (techLower.includes('sharepoint')) return 'tech-sharepoint';

   // Styling & CSS
   if (techLower.includes('tailwind')) return 'tech-tailwind';
   if (techLower.includes('bootstrap')) return 'tech-bootstrap';
   if (techLower.includes('scss') || techLower.includes('sass')) return 'tech-scss';
   if (techLower.includes('css')) return 'tech-css';
   if (techLower.includes('styled-components')) return 'tech-styled-components';
   if (techLower.includes('chakra')) return 'tech-chakra';
   if (techLower.includes('material')) return 'tech-material';

   // Cloud & DevOps
   if (techLower.includes('docker')) return 'tech-docker';
   if (techLower.includes('kubernetes') || techLower.includes('k8s')) return 'tech-kubernetes';
   if (techLower.includes('aws')) return 'tech-aws';
   if (techLower.includes('azure')) return 'tech-azure';
   if (techLower.includes('gcp') || techLower.includes('google cloud')) return 'tech-gcp';
   if (techLower.includes('vercel')) return 'tech-vercel';
   if (techLower.includes('netlify')) return 'tech-netlify';
   if (techLower.includes('heroku')) return 'tech-heroku';

   // Version Control & Tools
   if (techLower.includes('git')) return 'tech-git';
   if (techLower.includes('github')) return 'tech-github';
   if (techLower.includes('gitlab')) return 'tech-gitlab';
   if (techLower.includes('jenkins')) return 'tech-jenkins';
   if (techLower.includes('webpack')) return 'tech-webpack';
   if (techLower.includes('vite')) return 'tech-vite';

   // Mobile Development
   if (techLower.includes('flutter')) return 'tech-flutter';
   if (techLower.includes('react native')) return 'tech-react-native';
   if (techLower.includes('ionic')) return 'tech-ionic';
   if (techLower.includes('android')) return 'tech-android';
   if (techLower.includes('ios')) return 'tech-ios';

   // Testing
   if (techLower.includes('jest')) return 'tech-jest';
   if (techLower.includes('cypress')) return 'tech-cypress';
   if (techLower.includes('selenium')) return 'tech-selenium';
   if (techLower.includes('testing')) return 'tech-testing';

   // Data & Analytics
   if (techLower.includes('tableau')) return 'tech-tableau';
   if (techLower.includes('pandas')) return 'tech-pandas';
   if (techLower.includes('numpy')) return 'tech-numpy';
   if (techLower.includes('jupyter')) return 'tech-jupyter';
   if (techLower.includes('r')) return 'tech-r';

   // CMS & E-commerce
   if (techLower.includes('wordpress')) return 'tech-wordpress';
   if (techLower.includes('shopify')) return 'tech-shopify';
   if (techLower.includes('magento')) return 'tech-magento';
   if (techLower.includes('strapi')) return 'tech-strapi';

   return 'tech-default';
 }
}