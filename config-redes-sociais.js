// Configuração das Redes Sociais - MK Audiovisual
// Edite os links abaixo com suas redes sociais reais

const REDES_SOCIAIS = {
    instagram: 'https://www.instagram.com/mkaudiovisual',
    facebook: 'https://www.facebook.com/mkaudiovisual',
    whatsapp: 'https://wa.me/5511999999999', // Substitua pelo número real (formato: 5511999999999)
    youtube: 'https://www.youtube.com/@mkaudiovisual',
    email: 'contato@mkaudiovisual.com.br',
    telefone: '+5511999999999' // Formato internacional
};

// Função para atualizar os links no HTML
function atualizarLinksRedesSociais() {
    // Atualizar links na tela final
    const instagramFinal = document.querySelector('#final-intro a[href*="instagram"]');
    const facebookFinal = document.querySelector('#final-intro a[href*="facebook"]');
    const whatsappFinal = document.querySelector('#final-intro a[href*="wa.me"]');
    const youtubeFinal = document.querySelector('#final-intro a[href*="youtube"]');
    
    if(instagramFinal) instagramFinal.href = REDES_SOCIAIS.instagram;
    if(facebookFinal) facebookFinal.href = REDES_SOCIAIS.facebook;
    if(whatsappFinal) whatsappFinal.href = REDES_SOCIAIS.whatsapp;
    if(youtubeFinal) youtubeFinal.href = REDES_SOCIAIS.youtube;
    
    // Atualizar links no rodapé
    const instagramFooter = document.querySelector('footer a[href*="instagram"]');
    const facebookFooter = document.querySelector('footer a[href*="facebook"]');
    const whatsappFooter = document.querySelector('footer a[href*="wa.me"]');
    const youtubeFooter = document.querySelector('footer a[href*="youtube"]');
    const emailFooter = document.querySelector('footer a[href^="mailto"]');
    const telefoneFooter = document.querySelector('footer a[href^="tel"]');
    
    if(instagramFooter) instagramFooter.href = REDES_SOCIAIS.instagram;
    if(facebookFooter) facebookFooter.href = REDES_SOCIAIS.facebook;
    if(whatsappFooter) whatsappFooter.href = REDES_SOCIAIS.whatsapp;
    if(youtubeFooter) youtubeFooter.href = REDES_SOCIAIS.youtube;
    if(emailFooter) emailFooter.href = `mailto:${REDES_SOCIAIS.email}`;
    if(telefoneFooter) telefoneFooter.href = `tel:${REDES_SOCIAIS.telefone}`;
}

// Executar quando a página carregar
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', atualizarLinksRedesSociais);
}
