package vg.samuel.justiniani.hackathon.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import vg.samuel.justiniani.hackathon.model.FichaBibliografica;
import vg.samuel.justiniani.hackathon.repository.FichasBibliograficaRepository;
import vg.samuel.justiniani.hackathon.service.FichasBibliograficaService;

import javax.sql.DataSource;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FichasBibliograficaServiceImpl implements FichasBibliograficaService {

    private final FichasBibliograficaRepository fichasBibliograficaRepository;
    private final DataSource dataSource;

    @Override
    public List<FichaBibliografica> findAll() {
        return fichasBibliograficaRepository.findAll();
    }

    @Override
    public List<FichaBibliografica> findByEstado(Boolean estado) {
        return fichasBibliograficaRepository.findByEstado(estado);
    }

    @Override
    public FichaBibliografica findById(Integer id) {
        return fichasBibliograficaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));
    }

    @Transactional // Mantener Transactional para operaciones de escritura
    @Override
    public FichaBibliografica save(FichaBibliografica ficha) {
        ficha.setEstado(true); // Siempre establece el estado a true para nuevas fichas
        ficha.setFechaAgregada(LocalDate.now()); // Siempre establece la fecha actual para nuevas fichas
        return fichasBibliograficaRepository.save(ficha);
    }

    @Transactional // Mantener Transactional para operaciones de escritura
    @Override
    public FichaBibliografica update(Integer id, FichaBibliografica ficha) {
        FichaBibliografica oldFicha = fichasBibliograficaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));
        oldFicha.setAutor(ficha.getAutor());
        oldFicha.setTitulo(ficha.getTitulo());
        oldFicha.setTipoDocumento(ficha.getTipoDocumento());
        oldFicha.setAnioPublicacion(ficha.getAnioPublicacion());
        oldFicha.setEditorial(ficha.getEditorial());
        oldFicha.setNumeroEdicion(ficha.getNumeroEdicion());
        oldFicha.setNumeroPaginas(ficha.getNumeroPaginas());
        oldFicha.setTema(ficha.getTema());
        // No actualices fechaAgregada ni estado aquí, ya que se manejan en la creación o por la base de datos
        return fichasBibliograficaRepository.save(oldFicha);
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        FichaBibliografica ficha = fichasBibliograficaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));
        ficha.setEstado(false);
        fichasBibliograficaRepository.save(ficha);
    }

    @Transactional
    @Override
    public FichaBibliografica restore(Integer id) {
        FichaBibliografica ficha = fichasBibliograficaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha no encontrada"));
        ficha.setEstado(true);
        return fichasBibliograficaRepository.save(ficha);
    }

    @Override
    public byte[] generateJasperPdfReport() throws Exception {
        InputStream jasperStream = new ClassPathResource("reportes/hackathon.jasper").getInputStream();
        HashMap<String, Object> params = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, dataSource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
// Compare this snippet from src/main/java/vg/samuel/justiniani/hackathon/repository/FichasBibliograficaRepository.java: