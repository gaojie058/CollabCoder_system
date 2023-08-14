
alphabets= "([A-Za-z])"
prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
suffixes = "(Inc|Ltd|Jr|Sr|Co)"
starters = "(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
websites = "[.](com|net|org|io|gov)"
digits = "([0-9])"

function split_into_sentences(text){
        text = " " + text + "  "
        text = text.replaceAll("\n"," ")
        text.replaceAll(prefixes,"\\1<prd>")
        text.replaceAll(websites,"<prd>\\1")
        text.replaceAll(digits + "[.]" + digits,"\\1<prd>\\2")
        if (text.includes("...") ){
            text = text.replaceAll("...","<prd><prd><prd>")} 
        if (text.includes("Ph.D")){
            text = text.replaceAll("Ph.D.","Ph<prd>D<prd>")}  
        text.replaceAll("\s" + alphabets + "[.] "," \\1<prd> ")
        text.replaceAll(acronyms+" "+starters,"\\1<stop> \\2")
        text.replaceAll(alphabets + "[.]" + alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>\\3<prd>")
        text.replaceAll(alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>")
        text.replaceAll(" "+suffixes+"[.] "+starters," \\1<stop> \\2")
        text.replaceAll(" "+suffixes+"[.]"," \\1<prd>")
        text.replaceAll(" " + alphabets + "[.]"," \\1<prd>")

        if (text.includes( "”") ){
            text = text.replaceAll(".”","”.")} 
        if (text.includes( "\"") ){
            text = text.replaceAll(".\"","\".")} 
        if (text.includes( "!" ) ){
            text = text.replaceAll("!\"","\"!")} 
           
        if (text.includes( "?" ) ){
            text = text.replaceAll("?\"","\"?")} 
        text = text.replaceAll(".",".<stop>")
        // console.log((text))
        text = text.replaceAll("?","?<stop>")
        text = text.replaceAll("!","!<stop>")
        text = text.replaceAll("<prd>",".")
        sentences = text.split("<stop>")
        // sentences = text.split(".")
        return sentences}


function split_into_paragraphs(text){
    return text.split('\n\n') 
}

module.exports.split_into_sentences = split_into_sentences
module.exports.split_into_paragraphs = split_into_paragraphs