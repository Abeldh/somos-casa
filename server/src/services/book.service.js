import prisma from '../config/database.js';
function generateSlug(title){return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export const bookService = {
  async getAll({category,search,featured,page=1,limit=12}){const where={isActive:true};if(category)where.category=category;if(featured)where.isFeatured=true;if(search){where.OR=[{title:{contains:search,mode:'insensitive'}},{author:{contains:search,mode:'insensitive'}}];}const skip=(page-1)*limit;const [books,total]=await Promise.all([prisma.book.findMany({where,skip,take:limit,orderBy:{createdAt:'desc'}}),prisma.book.count({where})]);return {books,total,pages:Math.ceil(total/limit),page};},
  async getBySlug(slug){const book=await prisma.book.findUnique({where:{slug}});if(!book){const e=new Error('Libro no encontrado');e.statusCode=404;throw e;}return {book};},
  async getCategories(){const r=await prisma.book.findMany({where:{isActive:true,category:{not:null}},select:{category:true},distinct:['category']});return {categories:r.map(b=>b.category).filter(Boolean)};},
  async getFeatured(){const books=await prisma.book.findMany({where:{isActive:true,isFeatured:true},take:8,orderBy:{createdAt:'desc'}});return {books};},
  async getAllAdmin(){const books=await prisma.book.findMany({orderBy:{createdAt:'desc'}});return {books};},
  async create(data){let slug=generateSlug(data.title);const ex=await prisma.book.findUnique({where:{slug}});if(ex)slug=`${slug}-${Date.now().toString(36)}`;const book=await prisma.book.create({data:{...data,slug}});return {book};},
  async update(id,data){if(data.title){let slug=generateSlug(data.title);const ex=await prisma.book.findFirst({where:{slug,id:{not:id}}});if(ex)slug=`${slug}-${Date.now().toString(36)}`;data.slug=slug;}const book=await prisma.book.update({where:{id},data});return {book};},
  async remove(id){await prisma.book.update({where:{id},data:{isActive:false}});return {message:'Libro desactivado'};},
  async toggleFeatured(id){const b=await prisma.book.findUnique({where:{id}});if(!b){const e=new Error('No encontrado');e.statusCode=404;throw e;}const u=await prisma.book.update({where:{id},data:{isFeatured:!b.isFeatured}});return {book:u};},
};
