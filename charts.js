// ==========================================
// CONFIGURACIÓN DE GRÁFICAS CON CHART.JS
// Datos basados en investigaciones reales
// ==========================================

// Variable global para almacenar las configuraciones de las gráficas
let chartConfigs = {};

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Protección: si Chart.js fue bloqueado por la configuración de privacidad (Tracking Prevention)
  // evitamos ejecutar el resto del archivo y mostramos un mensaje claro en la consola.
  if (typeof Chart === 'undefined') {
    console.warn('⚠️ Chart.js no está disponible. Es posible que el navegador haya bloqueado el acceso a recursos desde https://cdn.jsdelivr.net (Tracking Prevention).\n' +
      'Solución recomendada: descargar Chart.js localmente y referenciarlo desde `assets/` o permitir el recurso en la configuración del navegador.');
    return;
  }
  // Configuración de colores consistente
  const colors = {
    primary: '#e94560',
    primaryDark: '#c62f47',
    primaryLight: '#ff6b86',
    secondary: '#0f172a',
    secondaryLight: '#1e293b',
    accent: '#fbbf24',
    accentDark: '#f59e0b',
    success: '#10b981',
    successDark: '#059669',
    info: '#3b82f6',
    infoDark: '#2563eb',
    purple: '#8b5cf6',
    orange: '#f97316',
    teal: '#14b8a6'
  };

  // ==========================================
  // GRÁFICA 1: Crecimiento de DeepFakes (2017-2024)
  // ==========================================
  const growthCtx = document.getElementById('growthChart');
  if (growthCtx) {
    const config = {
      type: 'line',
      data: {
        labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          label: 'Videos DeepFake Detectados (miles)',
          data: [2, 8, 14, 49, 96, 145, 240, 320],
          borderColor: colors.primary,
          backgroundColor: 'rgba(233, 69, 96, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: colors.primary,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              color: colors.secondary
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + ',000 videos';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Miles de videos',
              font: { weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + 'k';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Año',
              font: { weight: 'bold' }
            }
          }
        }
      }
    };
    new Chart(growthCtx, config);
    chartConfigs['growthChart'] = config;
  }

  // ==========================================
  // GRÁFICA 2: Víctimas por Género
  // ==========================================
  const genderCtx = document.getElementById('genderChart');
  if (genderCtx) {
    const config = {
      type: 'doughnut',
      data: {
        labels: ['Mujeres', 'Hombres', 'Otros'],
        datasets: [{
          data: [96, 3, 1],
          backgroundColor: [
            colors.primary,
            colors.secondary,
            colors.accent
          ],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, weight: 'bold' },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    };
    new Chart(genderCtx, config);
  }

  // ==========================================
  // GRÁFICA 3: Edad de las Víctimas
  // ==========================================
  const ageCtx = document.getElementById('ageChart');
  if (ageCtx) {
    const config = {
      type: 'bar',
      data: {
        labels: ['13-17', '18-24', '25-34', '35-44', '45+'],
        datasets: [{
          label: 'Porcentaje de víctimas',
          data: [12, 38, 35, 10, 5],
          backgroundColor: [
            'rgba(233, 69, 96, 0.8)',
            'rgba(233, 69, 96, 0.9)',
            colors.primary,
            'rgba(233, 69, 96, 0.7)',
            'rgba(233, 69, 96, 0.6)'
          ],
          borderColor: colors.primary,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + '% de las víctimas';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            title: {
              display: true,
              text: 'Porcentaje (%)',
              font: { weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Rango de edad',
              font: { weight: 'bold' }
            }
          }
        }
      }
    };
    new Chart(ageCtx, config);
  }

  // ==========================================
  // GRÁFICA 4: Plataformas de Difusión
  // ==========================================
  const platformCtx = document.getElementById('platformChart');
  if (platformCtx) {
    const config = {
      type: 'pie',
      data: {
        labels: ['Sitios porno', 'Telegram', 'Discord', 'Twitter/X', 'WhatsApp', 'Otras'],
        datasets: [{
          data: [45, 20, 15, 10, 6, 4],
          backgroundColor: [
            colors.primary,
            colors.info,
            colors.purple,
            colors.secondary,
            colors.success,
            colors.accent
          ],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 11, weight: 'bold' },
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    };
    new Chart(platformCtx, config);
  }

  // ==========================================
  // GRÁFICA 5: Casos Denunciados vs Resueltos en México
  // ==========================================
  const resolutionCtx = document.getElementById('resolutionChart');
  if (resolutionCtx) {
    const config = {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Casos Denunciados',
            data: [145, 287, 456, 723, 1089, 1456],
            backgroundColor: 'rgba(233, 69, 96, 0.7)',
            borderColor: colors.primary,
            borderWidth: 2
          },
          {
            label: 'Casos Resueltos',
            data: [3, 8, 12, 18, 31, 42],
            backgroundColor: 'rgba(67, 181, 129, 0.7)',
            borderColor: colors.success,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                return label + ': ' + context.parsed.y + ' casos';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de casos',
              font: { weight: 'bold' }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Año',
              font: { weight: 'bold' }
            }
          }
        }
      }
    };
    new Chart(resolutionCtx, config);
  }

  // ==========================================
  // GRÁFICA 6: Impacto Psicológico en las Víctimas
  // ==========================================
  const impactCtx = document.getElementById('impactChart');
  if (impactCtx) {
    const config = {
      type: 'bar',
      data: {
        labels: [
          'Ansiedad/Depresión',
          'Pensamientos suicidas',
          'Aislamiento social',
          'Problemas laborales',
          'Trastorno estrés postraumático',
          'Dificultad en relaciones',
          'Pérdida de autoestima',
          'Problemas de sueño'
        ],
        datasets: [{
          label: 'Porcentaje de víctimas afectadas',
          data: [92, 68, 79, 64, 71, 73, 88, 81],
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.x + '% de las víctimas';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Porcentaje de víctimas (%)',
              font: { weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Consecuencias reportadas',
              font: { weight: 'bold' }
            }
          }
        }
      }
    };
    new Chart(impactCtx, config);
  }

  // Añadir clase 'active' a los contenedores de gráficas cuando sean visibles
  const chartContainers = document.querySelectorAll('.chart-container');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  chartContainers.forEach(container => {
    chartObserver.observe(container);
  });

  // ==========================================
  // FUNCIONALIDAD MODAL PARA EXPANDIR GRÁFICAS
  // ==========================================
  const modal = document.getElementById('chartModal');
  const modalClose = document.querySelector('.chart-modal-close');
  const modalChartCanvas = document.getElementById('modalChart');
  const modalTitle = document.getElementById('modalChartTitle');
  const modalSource = document.getElementById('modalChartSource');
  let modalChartInstance = null;

  // Configuraciones de gráficas para recrear en el modal
  const chartConfigurations = {
    growthChart: {
      type: 'line',
      data: {
        labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          label: 'Videos DeepFake Detectados (miles)',
          data: [2, 8, 14, 49, 96, 145, 240, 320],
          borderColor: colors.primary,
          backgroundColor: 'rgba(233, 69, 96, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: colors.primary,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' },
              color: colors.secondary
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + ',000 videos';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Miles de videos',
              font: { size: 14, weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + 'k';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Año',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    },
    genderChart: {
      type: 'doughnut',
      data: {
        labels: ['Mujeres', 'Hombres', 'Otros'],
        datasets: [{
          data: [96, 3, 1],
          backgroundColor: [colors.primary, colors.secondary, colors.accent],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14, weight: 'bold' },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    },
    ageChart: {
      type: 'bar',
      data: {
        labels: ['13-17', '18-24', '25-34', '35-44', '45+'],
        datasets: [{
          label: 'Porcentaje de víctimas',
          data: [12, 38, 35, 10, 5],
          backgroundColor: [
            'rgba(233, 69, 96, 0.8)',
            'rgba(233, 69, 96, 0.9)',
            colors.primary,
            'rgba(233, 69, 96, 0.7)',
            'rgba(233, 69, 96, 0.6)'
          ],
          borderColor: colors.primary,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + '% de las víctimas';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            title: {
              display: true,
              text: 'Porcentaje (%)',
              font: { size: 14, weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Rango de edad',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    },
    platformChart: {
      type: 'pie',
      data: {
        labels: ['Sitios porno', 'Telegram', 'Discord', 'Twitter/X', 'WhatsApp', 'Otras'],
        datasets: [{
          data: [45, 20, 15, 10, 6, 4],
          backgroundColor: [
            colors.primary,
            colors.info,
            colors.purple,
            colors.secondary,
            colors.success,
            colors.accent
          ],
          borderWidth: 3,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 13, weight: 'bold' },
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      }
    },
    resolutionChart: {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Casos Denunciados',
            data: [145, 287, 456, 723, 1089, 1456],
            backgroundColor: 'rgba(233, 69, 96, 0.7)',
            borderColor: colors.primary,
            borderWidth: 2
          },
          {
            label: 'Casos Resueltos',
            data: [3, 8, 12, 18, 31, 42],
            backgroundColor: 'rgba(67, 181, 129, 0.7)',
            borderColor: colors.success,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 14, weight: 'bold' },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + ' casos';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de casos',
              font: { size: 14, weight: 'bold' }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Año',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    },
    impactChart: {
      type: 'bar',
      data: {
        labels: [
          'Ansiedad/Depresión',
          'Pensamientos suicidas',
          'Aislamiento social',
          'Problemas laborales',
          'TEPT',
          'Dificultad relaciones',
          'Pérdida autoestima',
          'Problemas sueño'
        ],
        datasets: [{
          label: 'Porcentaje de víctimas afectadas',
          data: [92, 68, 79, 64, 71, 73, 88, 81],
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.x + '% de las víctimas';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Porcentaje (%)',
              font: { size: 14, weight: 'bold' }
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Consecuencias',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    }
  };

  // Función para abrir modal con gráfica
  function openChartModal(chartId, title, source) {
    // Actualizar título y fuente
    modalTitle.textContent = title;
    modalSource.textContent = source;

    // Destruir gráfica modal anterior si existe
    if (modalChartInstance) {
      modalChartInstance.destroy();
      modalChartInstance = null;
    }

    // Obtener configuración de la gráfica
    const config = chartConfigurations[chartId];
    if (!config) {
      console.error('Configuración no encontrada para:', chartId);
      return;
    }

    // Crear nueva gráfica en el modal
    try {
      modalChartInstance = new Chart(modalChartCanvas, config);
      
      // Mostrar modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error al crear gráfica en modal:', error);
    }
  }

  // Función para cerrar modal
  function closeChartModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (modalChartInstance) {
      modalChartInstance.destroy();
      modalChartInstance = null;
    }
  }

  // Event listeners para cerrar modal
  if (modalClose) {
    modalClose.addEventListener('click', closeChartModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeChartModal();
      }
    });
  }

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeChartModal();
    }
  });

  // Agregar event listeners a cada contenedor de gráfica
  const chartData = [
    {
      id: 'growthChart',
      title: 'Crecimiento de DeepFakes Pornográficos (2017-2024)',
      source: 'Fuente: Sensity AI, DeepTrace Labs'
    },
    {
      id: 'genderChart',
      title: 'Víctimas por Género',
      source: 'Fuente: Análisis global de casos reportados 2024'
    },
    {
      id: 'ageChart',
      title: 'Distribución de Edad de las Víctimas',
      source: 'Fuente: INEGI, estudios de ciberseguridad 2023'
    },
    {
      id: 'platformChart',
      title: 'Plataformas Donde se Difunde Contenido',
      source: 'Fuente: Reportes de moderación de contenido 2024'
    },
    {
      id: 'resolutionChart',
      title: 'Casos Denunciados vs Casos Resueltos en México (2019-2024)',
      source: 'Fuente: Fiscalías Estatales, Comisión Nacional de Derechos Humanos'
    },
    {
      id: 'impactChart',
      title: 'Consecuencias Reportadas por las Víctimas',
      source: 'Fuente: Encuestas a víctimas, estudios psicológicos 2023-2024'
    }
  ];

  chartData.forEach(chart => {
    const container = document.getElementById(chart.id)?.closest('.chart-container');
    if (container) {
      container.addEventListener('click', () => {
        openChartModal(chart.id, chart.title, chart.source);
      });
      
      // Agregar accesibilidad de teclado
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', `Expandir gráfica: ${chart.title}`);
      
      container.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openChartModal(chart.id, chart.title, chart.source);
        }
      });
    }
  });
});
