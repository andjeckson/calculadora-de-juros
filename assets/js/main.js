$ = document.querySelector.bind(document)


 let entradaCapital = calculadora.capital
 let entradaTaxa    = calculadora.taxa
 let entradaTempo   = calculadora.tempo
 let botaoCalcular  = calculadora.calcular
 

// Calcula uma expressão e converte em duas casas decimais.

function calcular( expressao ){
   return Number(eval(expressao).toFixed(2))
}

// Calcula os juros simples

function calcularJurosSimples( dados = {}){
  const {C, i, t} = dados
  
   const J = calcular(C * (i/100) * t) // Fórmula J = C•i•t
   
   const M = C + J
   
   return {
       capitalInicial: converterEmReal(C),
       juros: converterEmReal(J),
       montante: converterEmReal(M)
   }
}

// Calcula os juros compostos

function calcularJurosCompostos(dados = {}){
  const { C, i, t:n } = dados
 
  const M = calcular(C * ((1 + (i/100)) ** n)) // fórmula M = C•(1+i)^n
  const J = M - C
  
  return {
        capitalInicial: converterEmReal(C),
        juros: converterEmReal(J),
        montante: converterEmReal(M)
  }
}

//Verifica o tipo de juros e calcula invocando a respectivas função

function calcularJuros(dados = {}){
   let tipoDeJuros = calculadora.tipoDeJuros.value
   
    return tipoDeJuros === 'simples' ?
                   calcularJurosSimples(dados) :
                   calcularJurosCompostos(dados)
   
}


function dividirPorCem( num ){
   let numero = Number(num/100).toFixed(2)
     
       return numero
}

// Converte valores em Real

function converterEmReal( valor ){
  
     const CONVERSOR = Intl.NumberFormat('pt-br',{
       style: 'currency',
       currency: 'BRL',
   })
    
    const VALOR_CONVERTIDO = CONVERSOR.format(valor)
    
    return VALOR_CONVERTIDO
}



// Cria um efeito de bolha estourando

function efeitoBolha(elemento, evento) {

   let elm = elemento
       elm.classList.add('efeito-bolha')
   
   const clientRect = elm.getBoundingClientRect()
   const { width:w, height:h} = clientRect
   
   const { offsetLeft, offsetTop } = elm
   const {pageX, pageY} = evento
   

   let [x, y, r] = [
             pageX - offsetLeft, // distância x
             pageY - offsetTop, // distância y
             Math.max(w, h) * Math.PI // raio
     ]
   
   // Cria a bolha e adiciona ao elemento
   
   function criarBolha(r, x, y){
      let bolha = document.createElement('span')
          bolha.classList.add('bolha')
          
          bolha.style.setProperty('--r', r + 'px')
          bolha.style.left = x + 'px'
          bolha.style.top  = y + 'px'
          
          return bolha
   }
   
   let bolha = criarBolha(r, x, y)
       elm.appendChild(bolha)
       
       // Remove a bolha ao terminar a animação
       bolha.onanimationend = ()=>{
            bolha.remove()
         }
}


 botaoCalcular.onclick = (e)=> efeitoBolha(botaoCalcular, e)



function validarCaixaDeEntrada( entrada ){
    let memoria = ''
    entrada.onkeyup = (e)=>{
      const tecla = e.key
      
      // Verifica se a tecla é numérica
       if(String(tecla).match(/[0-9]/)){
          memoria += tecla // adiciona um número à variável memoria
       }else if( tecla === 'Backspace'){
         // Se for backspace deleta um número da variável memoria
           memoria = memoria.substring(0, memoria.length-1)
       }
       
       entrada.value = dividirPorCem(memoria)
    }
}

validarCaixaDeEntrada(entradaCapital)
validarCaixaDeEntrada(entradaTaxa)
    


 calculadora.onsubmit = ()=>{
     let { capital, taxa, tempo} = calculadora
     
     let calculo = calcularJuros({
         C: Number(capital.value),
         i: Number(taxa.value),
         t: Number(tempo.value)
     })
     
     setTimeout(()=> abrirModal(calculo), 400)
 }
 

function abrirModal( dados = {}){
  
  const { capitalInicial:capital, juros, montante } = dados
  
   let modal    = $('.modal')
   let caixa    = $('.modal .caixa')
   let btnModal = $('#btnModal')
   
   let cedulaCapital  = $('#valorCapital')
   let cedulaJuros    = $('#valorJuros')
   let cedulaMontante = $('#valorMontante')
   
   
   cedulaCapital.innerHTML  = capital
   cedulaJuros.innerHTML    = juros
   cedulaMontante.innerHTML = montante
   
   modal.show()
       
       btnModal.onclick = ()=> fecharModal()
       
       // Cria uma animação para fechar o modal
       function fecharModal(){
           caixa.animate([{
               opacity: 1,
               transform: 'scale(1)'
           },{
               opacity: 0,
               transform: 'scale(.9)'
           }],{
               duration: 350,
               easing: 'ease'
           })
           
           setTimeout(()=>{
               modal.close()
           }, 330)
       }
}


let telaDeAbertura = document.querySelector('.abertura')
    telaDeAbertura.onanimationend = ()=> telaDeAbertura.remove()


