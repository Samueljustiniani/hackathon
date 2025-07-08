package vg.samuel.justiniani.hackathon.service;

import java.util.List;

import vg.samuel.justiniani.hackathon.model.FichaBibliografica;

public interface FichasBibliograficaService {
    List<FichaBibliografica> findAll();
    List<FichaBibliografica> findByEstado(Boolean estado);
    FichaBibliografica findById(Integer id);
    FichaBibliografica save(FichaBibliografica ficha);
    FichaBibliografica update(Integer id, FichaBibliografica ficha);
    void delete(Integer id);

    FichaBibliografica restore(Integer id);
    byte[] generateJasperPdfReport() throws Exception;

}
