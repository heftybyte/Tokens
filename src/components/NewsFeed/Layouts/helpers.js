export const getLinkTextByType = (type) => {
  switch(type) {
    case "ARTICLE":
        return "VIEW ARTICLE"
    case "AD":
        return "LEARN MORE"
    default:
      return "VISIT LINK"
  } 
}