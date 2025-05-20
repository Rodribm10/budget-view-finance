
import { supabase } from "@/integrations/supabase/client";
import { Transaction, CategorySummary } from "@/types/financialTypes";

export async function getTransacoes(): Promise<Transaction[]> {
  console.log("Buscando transações do Supabase...");
  
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return [];
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  console.log("Buscando transações para o usuário com email:", normalizedEmail);
  
  try {
    // Primeiro, buscar todos os grupos do usuário pelo email
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', normalizedEmail);
      
    if (groupsError) {
      console.error('Erro ao buscar grupos do usuário:', groupsError);
    }
    
    // Extrair IDs dos grupos para usar no filtro
    const groupIds = userGroups ? userGroups.map(group => group.remote_jid) : [];
    console.log(`Encontrados ${groupIds.length} grupos vinculados ao usuário:`, groupIds);
    
    // Buscar transações com filtro baseado no email (login) ou grupo_id
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`)
      .order('quando', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      throw new Error('Não foi possível carregar as transações');
    }

    console.log("Transações encontradas:", data);

    // Transformar os dados recebidos para o formato esperado, normalizando os tipos
    return data.map((item: any) => ({
      id: item.id.toString(),
      user: item.user || '',
      login: item.login || normalizedEmail, // Garantir que o campo login esteja preenchido
      created_at: item.created_at,
      valor: item.tipo?.toLowerCase() === 'receita' ? Math.abs(item.valor || 0) : -Math.abs(item.valor || 0),
      quando: item.quando || new Date().toISOString(),
      detalhes: item.detalhes || '',
      estabelecimento: item.estabelecimento || '',
      tipo: item.tipo?.toLowerCase() || 'despesa',
      categoria: item.categoria || 'Outros',
      grupo_id: item.grupo_id || null
    }));
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
}

export async function getTransactionSummary() {
  console.log("Buscando resumo das transações...");
  
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return { receitas: 0, despesas: 0, saldo: 0 };
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // Primeiro, buscar todos os grupos do usuário pelo email
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', normalizedEmail);
      
    if (groupsError) {
      console.error('Erro ao buscar grupos do usuário:', groupsError);
    }
    
    // Extrair IDs dos grupos para usar no filtro
    const groupIds = userGroups ? userGroups.map(group => group.remote_jid) : [];
    
    // Buscar resumo das transações com filtro aprimorado baseado no email (login) ou grupo_id
    const { data, error } = await supabase
      .from('transacoes')
      .select('tipo, valor')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    if (error) {
      console.error('Erro ao buscar resumo das transações:', error);
      throw new Error('Não foi possível carregar o resumo das transações');
    }

    console.log("Dados para resumo encontrados:", data);

    const totalReceitas = data
      .filter((item: any) => item.tipo?.toLowerCase() === 'receita')
      .reduce((sum: number, item: any) => sum + Math.abs(item.valor || 0), 0);

    const totalDespesas = data
      .filter((item: any) => (item.tipo?.toLowerCase() === 'despesa'))
      .reduce((sum: number, item: any) => sum + Math.abs(item.valor || 0), 0);

    const resultado = {
      receitas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas
    };

    console.log("Resumo calculado:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar resumo das transações:', error);
    return { receitas: 0, despesas: 0, saldo: 0 };
  }
}

export async function getCategorySummary(tipoFiltro: string = 'despesa') {
  console.log(`Buscando resumo de categorias para tipo: ${tipoFiltro}`);
  
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return [];
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // Primeiro, buscar todos os grupos do usuário pelo email
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', normalizedEmail);
      
    if (groupsError) {
      console.error('Erro ao buscar grupos do usuário:', groupsError);
    }
    
    // Extrair IDs dos grupos para usar no filtro
    const groupIds = userGroups ? userGroups.map(group => group.remote_jid) : [];
    
    // Buscar resumo de categorias com filtro aprimorado baseado no email (login) ou grupo_id
    const { data, error } = await supabase
      .from('transacoes')
      .select('categoria, valor, tipo')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    if (error) {
      console.error('Erro ao buscar resumo de categorias:', error);
      throw new Error('Não foi possível carregar o resumo por categoria');
    }
    
    console.log("Dados de categorias encontrados:", data);
    
    // Filtrar conforme o tipo solicitado (receitas, despesas ou ambos)
    let filteredData = data;
    if (tipoFiltro.toLowerCase() === 'despesa') {
      filteredData = data.filter((item: any) => item.tipo?.toLowerCase() === 'despesa');
    } else if (tipoFiltro.toLowerCase() === 'receita') {
      filteredData = data.filter((item: any) => item.tipo?.toLowerCase() === 'receita');
    }
    
    console.log(`${filteredData.length} itens filtrados para tipo: ${tipoFiltro}`);
    
    // Agrupar por categoria
    const categorias: Record<string, number> = {};
    filteredData.forEach((item: any) => {
      if (item.valor) {
        const categoriaKey = item.categoria || 'Outros';
        if (!categorias[categoriaKey]) {
          categorias[categoriaKey] = 0;
        }
        categorias[categoriaKey] += Math.abs(item.valor);
      }
    });
    
    // Calcular o total para porcentagens
    const total = Object.values(categorias).reduce((sum, valor) => sum + valor, 0);

    // Cores para categorias (reuse das cores no mockData)
    const cores = ["#F59E0B", "#60A5FA", "#8B5CF6", "#EF4444", "#10B981", "#6366F1", "#EC4899", "#14B8A6"];
    
    // Mapear para o formato esperado
    const resultado = Object.entries(categorias).map(([categoria, valor], index) => ({
      categoria,
      valor,
      percentage: total > 0 ? valor / total : 0,
      color: cores[index % cores.length]
    }));

    console.log("Resumo de categorias calculado:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar resumo de categorias:', error);
    return [];
  }
}

export async function getMonthlyData() {
  console.log("Buscando dados mensais...");
  
  // Obter o email do usuário do localStorage
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    console.error('Email do usuário não encontrado no localStorage');
    return [];
  }
  
  // Normalizar o email (minúsculo e sem espaços)
  const normalizedEmail = userEmail.trim().toLowerCase();
  
  try {
    // Primeiro, buscar todos os grupos do usuário pelo email
    const { data: userGroups, error: groupsError } = await supabase
      .from('grupos_whatsapp')
      .select('remote_jid')
      .eq('login', normalizedEmail);
      
    if (groupsError) {
      console.error('Erro ao buscar grupos do usuário:', groupsError);
    }
    
    // Extrair IDs dos grupos para usar no filtro
    const groupIds = userGroups ? userGroups.map(group => group.remote_jid) : [];
    
    // Buscar dados mensais com filtro aprimorado baseado no email (login) ou grupo_id
    const { data, error } = await supabase
      .from('transacoes')
      .select('quando, valor, tipo')
      .or(`login.eq.${normalizedEmail},${groupIds.length > 0 ? `grupo_id.in.(${groupIds.map(id => `"${id}"`).join(',')})` : ''}`);

    if (error) {
      console.error('Erro ao buscar dados mensais:', error);
      throw new Error('Não foi possível carregar os dados mensais');
    }

    console.log("Dados mensais encontrados:", data);

    const meses: Record<string, { receitas: number, despesas: number }> = {};
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Inicializar meses
    nomesMeses.forEach(mes => {
      meses[mes] = { receitas: 0, despesas: 0 };
    });

    // Agrupar por mês, normalizando o tipo
    data.forEach((item: any) => {
      if (item.quando && item.valor) {
        const data = new Date(item.quando);
        const mesIndex = data.getMonth();
        const nomeMes = nomesMeses[mesIndex];
        
        if (item.tipo?.toLowerCase() === 'receita') {
          meses[nomeMes].receitas += Math.abs(item.valor);
        } else {
          meses[nomeMes].despesas += Math.abs(item.valor);
        }
      }
    });

    // Converter para o formato esperado
    const resultado = Object.entries(meses).map(([month, values]) => ({
      month,
      receitas: values.receitas,
      despesas: values.despesas
    }));

    console.log("Dados mensais calculados:", resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados mensais:', error);
    return [];
  }
}
