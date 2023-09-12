import { insert, type PostInsert } from '../schema/post'

const posts: PostInsert[] = [
  {
    title: 'Love me some programming',
    content: '<p>Programming is all I love my guy. You should definitely try it</p>',
    pitId: 'programming',
    userId: 'burtonium'
  },
  {
    title: 'Hate me some programming',
    content: '<p>Programming is all I hate my guy. Run while you can</p>',
    pitId: 'programming',
    userId: 'burtonium'
  },

  {
    title: 'Hate me some programming',
    content: '<p>Programming is all I hate my guy. Run while you can</p>',
    pitId: 'programming',
    userId: 'burtonium'
  }
]

export default posts.map(insert);