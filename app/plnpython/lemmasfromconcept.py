import spacy, sys

def main():
    array = sys.argv[1].split(',')    
    nlp = spacy.load('pt')
    result = ''
    for concept in array:        
        doc = nlp(concept)
        lemmas = [token.lemma_ for token in doc if (token.pos_ == 'NOUN' or token.pos_ == 'ADJ')]    
        concept_lemmas = " ".join(lemmas)
        if concept_lemmas not in result:
            result += ',' + concept_lemmas

    print(result[1:])

if __name__ == '__main__':
    main()

# lemmasfromconcept([u"mapas conceitual"])