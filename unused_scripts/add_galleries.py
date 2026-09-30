import re

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_galleries = '''export const weddingGalleries = [
  {
    id: "pooja-sai-charan",
    title: "Pooja & Sai Charan",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_6.jpeg", // TODO: replace with actual cover when uploaded
    photos: {
      "Gallery": [] // TODO: add public_ids
    }
  },
  {
    id: "anuhya-abhinav",
    title: "Anuhya & Abhinav",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_2.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "ellen-yashwanth",
    title: "Ellen & Yashwanth",
    location: "India",
    tags: "intimate",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_3.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "kavya-goutham",
    title: "Kavya & Goutham",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_4.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "mahesh-mounika",
    title: "Mahesh & Mounika",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_5.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "manasa-gokul",
    title: "Manasa & Gokul",
    location: "India",
    tags: "intimate",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_1.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "poojitha-pranay",
    title: "Poojitha & Pranay",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_7.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "reshma-prakash",
    title: "Reshma & Prakash",
    location: "India",
    tags: "traditional",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_8.jpeg",
    photos: {
      "Gallery": []
    }
  },
  {
    id: "sindhuja-akhil",
    title: "Sindhuja & Akhil",
    location: "India",
    tags: "destination",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "gallery_2.jpeg", // Using a placeholder since we ran out of gallery_X
    photos: {
      "Gallery": []
    }
  }
];'''

content = re.sub(r'export const weddingGalleries = \[.*?\];', new_galleries, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
