import { config } from 'dotenv';
import { AuthenticationUsers } from '../src/scopes/authenticationUser/entities/authenticationUser.entity';
import { Post } from '../src/scopes/post/entities/post.entity';
import { Follow } from '../src/scopes/follow/entities/follow.entity';
import { dataSource } from '../src/infrastructure/data-source';
import * as bcrypt from 'bcrypt';

config();

const avatars = Array.from(
  { length: 6 },
  (_, i) => `${process.env.AVATAR_BASE_URL}avatar${i + 1}.jpg`,
);

const users = [
  {
    name: 'Carla Dias',
    email: 'carla.dias@email.com',
    bio: 'Exploradora de novos horizontes.',
    location: 'Rio de Janeiro',
  },
  {
    name: 'Miguel Souza',
    email: 'miguel.souza@email.com',
    bio: 'Apaixonado por tecnologia e inovação.',
    location: 'São Paulo',
  },
  {
    name: 'Amanda Nunes',
    email: 'amanda.nunes@email.com',
    bio: 'Entusiasta de fotografia e viagens.',
    location: 'Curitiba',
  },
  {
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    bio: 'Desenvolvedor full stack e gamer.',
    location: 'Belo Horizonte',
  },
  {
    name: 'Fernanda Castro',
    email: 'fernanda.castro@email.com',
    bio: 'Viciada em café e livros.',
    location: 'Brasília',
  },
  {
    name: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    bio: 'Apreciador de música e boas conversas.',
    location: 'Salvador',
  },
  {
    name: 'Tatiane Ramos',
    email: 'tatiane.ramos@email.com',
    bio: 'Apaixonada por arte e criatividade.',
    location: 'Porto Alegre',
  },
  {
    name: 'Gabriel Santos',
    email: 'gabriel.santos@email.com',
    bio: 'Atleta e motivador nato.',
    location: 'Recife',
  },
  {
    name: 'Juliana Alves',
    email: 'juliana.alves@email.com',
    bio: 'Chef de cozinha em formação.',
    location: 'Fortaleza',
  },
  {
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    bio: 'Fã de ficção científica e programação.',
    location: 'Manaus',
  },
  {
    name: 'Priscila Rocha',
    email: 'priscila.rocha@email.com',
    bio: 'Amante de animais e natureza.',
    location: 'Florianópolis',
  },
  {
    name: 'Felipe Araújo',
    email: 'felipe.araujo@email.com',
    bio: 'Empreendedor e inovador.',
    location: 'Goiânia',
  },
];

const posts = [
  'Primeiro dia no novo projeto! Vai vir coisa boa por aí.',
  'Explorando novas tecnologias e aprendendo muito.',
  'Nada como um café forte para começar o dia.',
  'A vida é feita de desafios, e eu adoro superá-los!',
  'Música boa, um livro e um dia tranquilo.',
  'Desenvolvendo uma nova aplicação! Breve novidades.',
];

async function initializeDb() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepo = dataSource.getRepository(AuthenticationUsers);
  const postRepo = dataSource.getRepository(Post);
  const followRepo = dataSource.getRepository(Follow);

  const createdUsers = await Promise.all(
    users.map(async (user, index) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('12345678', saltRounds);

      const newUser = userRepo.create({
        ...user,
        password: hashedPassword,
        profilePicture: avatars[index % avatars.length],
        userType: 'REGULAR',
        accountStatus: 'ACTIVE',
      });

      return userRepo.save(newUser);
    }),
  );

  for (let i = 0; i < createdUsers.length / 2; i++) {
    const post = postRepo.create({
      content: posts[i % posts.length],
      author: createdUsers[i],
    });
    await postRepo.save(post);
  }

  for (let i = 0; i < createdUsers.length / 3; i++) {
    const follower = createdUsers[i];
    const following = createdUsers[createdUsers.length - i - 1];
    if (follower && following) {
      const follow = followRepo.create({ follower, following });
      await followRepo.save(follow);
    }
  }

  console.log('Database initialized successfully!');
}

initializeDb().catch((error) => console.error('Error initializing DB:', error));
