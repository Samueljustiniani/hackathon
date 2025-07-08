package vg.samuel.justiniani.hackathon.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vg.samuel.justiniani.hackathon.model.FichaBibliografica;

public interface FichasBibliograficaRepository extends JpaRepository<FichaBibliografica, Integer> {
    List<FichaBibliografica> findByEstado(Boolean estado);
}